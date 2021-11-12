// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { nanoid } from 'nanoid';
import {
  AddChatParticipantsResult,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadClient,
  ChatThreadItem,
  ChatThreadProperties,
  CreateChatThreadRequest,
  CreateChatThreadOptions,
  CreateChatThreadResult,
  SendChatMessageResult
} from '@azure/communication-chat';
import { CommunicationIdentifier, getIdentifierKind } from '@azure/communication-common';
import { ChatParticipant as SignalingChatParticipant } from '@azure/communication-signaling';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { latestMessageTimestamp, Model, Thread, ThreadEventEmitter } from './Model';
import { IChatClient, IChatThreadClient } from './types';
import { EventEmitter } from 'stream';

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

/**
 * A public interface compatible stub for ChatThreadClient.
 */
export class FakeChatThreadClient implements IChatThreadClient {
  constructor(private model: Model, private userId: CommunicationIdentifier, public threadId: string) {}

  getProperties(): Promise<ChatThreadProperties> {
    const thread = this.checkedGetThread();
    return Promise.resolve({
      id: thread.id,
      topic: thread.topic,
      createdOn: thread.createdOn,
      createdBy: thread.createdBy,
      deletedOn: thread.deletedOn
    });
  }

  updateTopic(topic: string): Promise<void> {
    this.modifyThreadForUser((thread) => {
      thread.topic = topic;
    });
    this.checkedGetThreadEventEmitter().chatThreadPropertiesUpdated({
      properties: { topic: topic },
      updatedOn: new Date(Date.now()),
      updatedBy: chatToSignalingParticipant(this.checkedGetMe()),
      threadId: this.threadId,
      version: `${this.checkedGetThread().version}`
    });
    return Promise.resolve();
  }

  sendMessage(): Promise<SendChatMessageResult> {
    return Promise.resolve({ id: '' });
  }
  getMessage(): Promise<ChatMessage> {
    return Promise.resolve({ id: '', type: 'text', sequenceId: '', version: '', createdOn: new Date(0) });
  }
  listMessages(): PagedAsyncIterableIterator<ChatMessage> {
    return pagedAsyncIterator([]);
  }
  deleteMessage(): Promise<void> {
    return Promise.resolve();
  }
  updateMessage(): Promise<void> {
    return Promise.resolve();
  }
  addParticipants(): Promise<AddChatParticipantsResult> {
    return Promise.resolve({});
  }
  listParticipants(): PagedAsyncIterableIterator<ChatParticipant> {
    return pagedAsyncIterator([]);
  }
  removeParticipant(): Promise<void> {
    return Promise.resolve();
  }
  sendTypingNotification(): Promise<boolean> {
    return Promise.resolve(false);
  }
  sendReadReceipt(): Promise<void> {
    return Promise.resolve();
  }
  listReadReceipts(): PagedAsyncIterableIterator<ChatMessageReadReceipt> {
    return pagedAsyncIterator([]);
  }

  private checkedGetThread(): Thread {
    return this.model.checkedGetThread(this.userId, this.threadId);
  }

  private modifyThreadForUser(action: (thread: Thread) => void) {
    this.model.modifyThreadForUser(this.userId, this.threadId, action);
  }

  private checkedGetThreadEventEmitter(): ThreadEventEmitter {
    return this.model.checkedGetThreadEventEmitter(this.userId, this.threadId);
  }

  private isMe(other: CommunicationIdentifier): boolean {
    return toFlatCommunicationIdentifier(other) === toFlatCommunicationIdentifier(this.userId);
  }

  private checkedGetMe(): ChatParticipant {
    const thread = this.checkedGetThread();
    const me = thread.participants.find((p) => this.isMe(p.id));
    if (!me) {
      throw new Error(`CHECK FAILED: ${this.userId} must be in ${thread.id}`);
    }
    return me;
  }
}

/**
 * A paged async operator that asynchronously iterates over values in an array.
 * In paging mode, the whole array is returned as a single page, ignoring all page size options.
 */
export const pagedAsyncIterator = <T>(values: T[]): PagedAsyncIterableIterator<T, T[]> => {
  async function* listAll(values: T[]): AsyncIterableIterator<T> {
    yield* values;
  }

  async function* listByPage(): AsyncIterableIterator<T[]> {
    yield* [values];
  }

  const iter = listAll(values);

  return {
    next(): Promise<IteratorResult<T, T>> {
      return iter.next();
    },
    [Symbol.asyncIterator]() {
      return this;
    },
    byPage: () => {
      return listByPage();
    }
  };
};

/**
 * An iterator that throws the given error when asynchronously iterating over items, directly or byPage.
 */
export const failingPagedAsyncIterator = <T>(error: Error): PagedAsyncIterableIterator<T, T[]> => {
  return {
    async next() {
      throw error;
    },
    [Symbol.asyncIterator]() {
      return this;
    },
    byPage: (): AsyncIterableIterator<T[]> => {
      return {
        async next() {
          throw error;
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
  };
};

const chatToSignalingParticipant = (p: ChatParticipant): SignalingChatParticipant => ({
  id: getIdentifierKind(p.id),
  displayName: p.displayName ?? '',
  shareHistoryTime: p.shareHistoryTime
});
