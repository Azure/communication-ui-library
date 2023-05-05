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
import {
  StatefulChatClient,
  StatefulChatClientArgs,
  _createStatefulChatClientWithDeps
} from '@internal/chat-stateful-client';

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
 * @returns
 */
export const createStatefulChatClientMock = (threadClient: PublicInterface<ChatThreadClient>): StatefulChatClient => {
  return _createStatefulChatClientWithDeps(createMockChatClient(threadClient), defaultClientArgs);
};
/**
 * @returns
 */
export function createMockChatClient(threadClient: PublicInterface<ChatThreadClient>): ChatClient {
  const mockEventHandlersRef = { value: {} };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockChatClient: ChatClient = {} as any;

  mockChatClient.createChatThread = async (request) => {
    return {
      chatThread: {
        id: 'chatThreadId',
        topic: request.topic,
        createdOn: new Date(0),
        createdBy: { kind: 'communicationUser', communicationUserId: 'user1' }
      }
    };
  };

  mockChatClient.listChatThreads = () => {
    return pagedAsyncIterator([]);
  };
  mockChatClient.deleteChatThread = () => {
    return Promise.resolve();
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mockChatClient.getChatThreadClient = (threadId) => {
    return threadClient as ChatThreadClient;
  };

  mockChatClient.on = ((event: Parameters<ChatClient['on']>[0], listener: (e: Event) => void) => {
    mockEventHandlersRef.value[event] = listener;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

  mockChatClient.off = ((event: Parameters<ChatClient['on']>[0], listener: (e: Event) => void) => {
    if (mockEventHandlersRef.value[event] === listener) {
      mockEventHandlersRef.value[event] = undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

  mockChatClient.startRealtimeNotifications = () => {
    throw new Error('Method not implemented.');
  };

  mockChatClient.stopRealtimeNotifications = () => {
    throw new Error('Method not implemented.');
  };

  return mockChatClient;
}
/**
 *
 */
export const defaultClientArgs: StatefulChatClientArgs = {
  displayName: '',
  userId: { communicationUserId: 'userId1' },
  endpoint: '',
  credential: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, jsdoc/require-jsdoc, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
    getToken(): any {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function, jsdoc/require-jsdoc
    dispose(): any {}
  }
};

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
