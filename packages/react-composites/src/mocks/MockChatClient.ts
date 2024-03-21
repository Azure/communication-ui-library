// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import { ChatThreadItem, CreateChatThreadResult } from '@azure/communication-chat';
import {
  StatefulChatClient,
  StatefulChatClientArgs,
  _createStatefulChatClientWithDeps
} from '@internal/chat-stateful-client';
import { ChatClientState, ChatErrors } from '@internal/chat-stateful-client';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

type PublicInterface<T> = { [K in keyof T]: T[K] };
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
  const mockEventHandlersRef: { value: { [key: string]: ((e: Event) => void) | undefined | null } } = { value: {} };
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
 * @private
 */
export class MockStatefulChatClient implements PublicInterface<StatefulChatClient> {
  private _threadClient: ChatThreadClient;

  constructor(threadClient: PublicInterface<ChatThreadClient>) {
    this._threadClient = threadClient as ChatThreadClient;
  }
  getChatThreadClient(): ChatThreadClient {
    return this._threadClient;
  }
  createChatThread(): Promise<CreateChatThreadResult> {
    throw new Error('Method not implemented.');
  }
  listChatThreads(): PagedAsyncIterableIterator<ChatThreadItem> {
    throw new Error('Method not implemented.');
  }
  deleteChatThread(): Promise<void> {
    return Promise.resolve();
  }
  startRealtimeNotifications(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  stopRealtimeNotifications(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  on(): void {
    return;
  }
  off(): void {
    return;
  }
  dispose(): void {
    throw new Error('Method not implemented.');
  }
  getState(): ChatClientState {
    return {
      userId: { id: 'userId1', kind: 'unknown' },
      displayName: 'displayName',
      threads: {
        threadId: {
          chatMessages: {},
          participants: {},
          threadId: 'threadId',
          readReceipts: [],
          typingIndicators: [],
          latestReadTime: new Date()
        }
      },
      latestErrors: {} as ChatErrors
    };
  }
  onStateChange(): void {
    return;
  }
  offStateChange(): void {
    throw new Error('Method not implemented.');
  }
  downloadResourceToCache(): void {
    throw new Error('Method not implemented.');
  }
  removeResourceFromCache(): void {
    throw new Error('Method not implemented.');
  }
}
