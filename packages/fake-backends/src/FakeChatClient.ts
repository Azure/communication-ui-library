// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { nanoid } from 'nanoid';
import {
  ChatParticipant,
  ChatThreadClient,
  ChatThreadItem,
  CreateChatThreadRequest,
  CreateChatThreadOptions,
  CreateChatThreadResult
} from '@azure/communication-chat';
import { CommunicationIdentifier, getIdentifierKind } from '@azure/communication-common';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Model, Thread } from './Model';
import { IChatClient, IChatThreadClient } from './types';
import { EventEmitter } from 'stream';
import { FakeChatThreadClient } from './FakeChatThreadClient';
import { chatToSignalingParticipant, pagedAsyncIterator, latestMessageTimestamp } from './utils';
import { ThreadEventEmitter } from './ThreadEventEmitter';

/**
 * A public interface compatible stub for ChatClient.
 */
export class FakeChatClient implements IChatClient {
  private realtimeNotificationsEnabled = false;
  private threadClients: FakeChatThreadClient[] = [];

  constructor(private model: Model, private userId: CommunicationIdentifier) {}

  getChatThreadClient(threadId: string): ChatThreadClient {
    this.model.checkedGetThread(this.userId, threadId);
    const threadClient = new FakeChatThreadClient(this.model, this.userId, threadId);
    this.threadClients.push(threadClient);
    return threadClient as IChatThreadClient as ChatThreadClient;
  }

  createChatThread(
    request: CreateChatThreadRequest,
    options?: CreateChatThreadOptions
  ): Promise<CreateChatThreadResult> {
    const participants = this.withCurrentUserInThread(options?.participants ?? []);
    const thread = {
      id: nanoid(),
      version: 0,
      createdOn: new Date(Date.now()),
      createdBy: getIdentifierKind(this.userId),
      topic: request.topic,
      participants,
      messages: [],
      emitter: new ThreadEventEmitter(new EventEmitter())
    };
    this.model.addThread(thread);
    return Promise.resolve({
      chatThread: {
        id: thread.id,
        createdOn: thread.createdOn,
        createdBy: thread.createdBy,
        topic: thread.topic
      }
    });
  }

  private withCurrentUserInThread(participants: ChatParticipant[]): ChatParticipant[] {
    if (this.containsMe(participants)) {
      return participants;
    }
    return [...participants, { id: this.userId }];
  }

  listChatThreads(): PagedAsyncIterableIterator<ChatThreadItem> {
    const threads = this.model.getThreadsForUser(this.userId);
    const response: ChatThreadItem[] = threads.map((t) => ({
      id: t.id,
      topic: t.topic,
      lastMessageReceivedOn: latestMessageTimestamp(t.messages)
    }));
    return pagedAsyncIterator(response);
  }

  deleteChatThread(threadId: string): Promise<void> {
    const now = new Date(Date.now());

    this.model.modifyThreadForUser(this.userId, threadId, (thread) => {
      thread.deletedOn = now;
    });

    const thread = this.model.checkedGetThread(this.userId, threadId);
    const me = this.checkedGetMe(thread);
    this.model.checkedGetThreadEventEmitter(this.userId, threadId).chatThreadDeleted({
      deletedOn: now,
      deletedBy: chatToSignalingParticipant(me),
      threadId: thread.id,
      version: `${thread.version}`
    });

    return Promise.resolve();
  }

  startRealtimeNotifications(): Promise<void> {
    this.realtimeNotificationsEnabled = true;
    return Promise.resolve();
  }

  stopRealtimeNotifications(): Promise<void> {
    this.realtimeNotificationsEnabled = false;
    // TODO unsubscribe from all events.
    throw new Error('Not Implemented');
  }

  // TODO tighten the type
  on(event: string, listener: any): void {
    if (!this.realtimeNotificationsEnabled) {
      throw new Error('Must enable real time notifications first');
    }
    // Only subscribe to events for threads for which a ChatThreadClient has been created.
    this.threadClients.forEach((c) =>
      this.model.checkedGetThreadEventEmitter(this.userId, c.threadId).on(event, listener)
    );
  }

  off(): void {
    throw new Error('Not implemented');
  }

  private isMe(other: CommunicationIdentifier): boolean {
    return toFlatCommunicationIdentifier(other) === toFlatCommunicationIdentifier(this.userId);
  }

  private containsMe(participants: ChatParticipant[]): boolean {
    return participants.some((p) => this.isMe(p.id));
  }

  private checkedGetMe(thread: Thread): ChatParticipant {
    const me = thread.participants.find((p) => this.isMe(p.id));
    if (!me) {
      throw new Error(`CHECK FAILED: ${this.userId} must be in ${thread.id}`);
    }
    return me;
  }
}
