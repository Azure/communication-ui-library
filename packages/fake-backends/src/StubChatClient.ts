// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AddChatParticipantsResult,
  ChatClient,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadClient,
  ChatThreadItem,
  ChatThreadProperties,
  CreateChatThreadResult,
  SendChatMessageResult
} from '@azure/communication-chat';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

type PublicInterface<T> = { [K in keyof T]: T[K] };

/**
 * A public interface compatible stub for ChatClient.
 */
export class StubChatClient implements PublicInterface<ChatClient> {
  private threadClient;

  /**
   * @param threadClient If set, an implementation of ChatThreadClient interface that is returned for *all* calls to
   * {@getChatThreadClient()}.
   */
  constructor(threadClient?: PublicInterface<ChatThreadClient>) {
    this.threadClient = threadClient;
  }

  getChatThreadClient(): ChatThreadClient {
    if (this.threadClient === undefined) {
      throw Error('stub method not implemented');
    }
    return this.threadClient;
  }
  createChatThread(): Promise<CreateChatThreadResult> {
    return Promise.resolve({});
  }
  listChatThreads(): PagedAsyncIterableIterator<ChatThreadItem> {
    return pagedAsyncIterator([]);
  }
  deleteChatThread(): Promise<void> {
    return Promise.resolve();
  }
  startRealtimeNotifications(): Promise<void> {
    return Promise.resolve();
  }
  stopRealtimeNotifications(): Promise<void> {
    return Promise.resolve();
  }
  on(): void {
    return;
  }
  off(): void {
    return;
  }
}

/**
 * A public interface compatible stub for ChatThreadClient.
 */
export class StubChatThreadClient implements PublicInterface<ChatThreadClient> {
  readonly threadId: string;

  constructor(threadId?: string) {
    this.threadId = threadId ?? '';
  }
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
