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
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { latestMessageTimestamp, Model, ThreadEventEmitter } from './Model';
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
    const threadClient = new FakeChatThreadClient(threadId);
    this.threadClients.push(threadClient);
    return threadClient as IChatThreadClient as ChatThreadClient;
  }

  createChatThread(
    request: CreateChatThreadRequest,
    options?: CreateChatThreadOptions
  ): Promise<CreateChatThreadResult> {
    const participants = this.ensureCurrentUserInThread(options?.participants ?? []);
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

  private ensureCurrentUserInThread(participants: ChatParticipant[]): ChatParticipant[] {
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
    const thread = this.model.checkedGetThread(this.userId, threadId);
    const me = thread.participants.find((p) => this.isMe(p.id));
    if (!me) {
      throw new Error(`CHECK FAILED: ${this.userId} must be in ${threadId}`);
    }

    thread.deletedOn = new Date(Date.now());
    thread.version++;

    this.model.checkedGetThreadEventEmitter(this.userId, threadId).chatThreadDeleted({
      deletedOn: thread.deletedOn,
      deletedBy: {
        id: getIdentifierKind(me.id),
        displayName: me.displayName ?? '',
        shareHistoryTime: me.shareHistoryTime
      },
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
}

/**
 * A public interface compatible stub for ChatThreadClient.
 */
export class FakeChatThreadClient implements IChatThreadClient {
  constructor(public threadId: string) {}

  getProperties(): Promise<ChatThreadProperties> {
    return Promise.resolve({ id: '', topic: '', createdOn: new Date(0) });
  }
  updateTopic(): Promise<void> {
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
