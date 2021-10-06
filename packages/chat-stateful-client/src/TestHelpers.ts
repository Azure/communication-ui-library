// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ChatClient, ChatThreadItem } from '@azure/communication-chat';
import { ChatClientState } from './ChatClientState';
import { createStatefulChatClientWithDeps, StatefulChatClient, StatefulChatClientArgs } from './StatefulChatClient';
import { createMockChatThreadClient } from './mocks/createMockChatThreadClient';
import { createMockIterator } from './mocks/createMockIterator';
import { MockCommunicationUserCredential } from './mocks/MockCommunicationUserCredential';

/**
 * @private
 */
export class StateChangeListener {
  state: ChatClientState;
  onChangeCalledCount = 0;

  constructor(client: StatefulChatClient) {
    this.state = client.getState();
    client.onStateChange(this.onChange.bind(this));
  }

  private onChange(newState: ChatClientState): void {
    this.onChangeCalledCount++;
    this.state = newState;
  }
}

/**
 * @private
 *
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

/**
 * @private
 */
export const defaultClientArgs: StatefulChatClientArgs = {
  displayName: '',
  userId: { communicationUserId: 'userId1' },
  endpoint: '',
  credential: new MockCommunicationUserCredential()
};

/**
 * @private
 */
export type StatefulChatClientWithEventTrigger = StatefulChatClient & {
  triggerEvent: (eventName: string, e: any) => Promise<void>;
};

/**
 * @private
 */
export const createStatefulChatClientMock = (): StatefulChatClientWithEventTrigger => {
  return createStatefulChatClientWithDeps(
    createMockChatClient(),
    defaultClientArgs
  ) as StatefulChatClientWithEventTrigger;
};

/**
 * @private
 */
export type ChatClientWithEventTrigger = ChatClient & {
  triggerEvent: (eventName: string, e: any) => Promise<void>;
};

/**
 * @private
 */
export function createMockChatClient(): ChatClientWithEventTrigger {
  const mockEventHandlersRef = { value: {} };
  const mockChatClient: ChatClientWithEventTrigger = {} as any;

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

  mockChatClient.listChatThreads = mockListChatThreads;

  mockChatClient.deleteChatThread = emptyAsyncFunctionWithResponse;

  mockChatClient.getChatThreadClient = (threadId) => {
    return createMockChatThreadClient(threadId);
  };

  mockChatClient.on = ((event: Parameters<ChatClient['on']>[0], listener: (e: Event) => void) => {
    mockEventHandlersRef.value[event] = listener;
  }) as any;

  mockChatClient.off = ((event: Parameters<ChatClient['on']>[0], listener: (e: Event) => void) => {
    if (mockEventHandlersRef.value[event] === listener) {
      mockEventHandlersRef.value[event] = undefined;
    }
  }) as any;

  mockChatClient.startRealtimeNotifications = emptyAsyncFunctionWithResponse;
  mockChatClient.stopRealtimeNotifications = emptyAsyncFunctionWithResponse;

  mockChatClient.triggerEvent = async (eventName: string, e: any): Promise<void> => {
    const handler = mockEventHandlersRef.value[eventName];
    if (handler !== undefined) {
      await handler(e);
    }
  };

  return mockChatClient;
}

const mockListChatThreads = (): any => {
  return createMockIterator(mockChatThreads);
};

// [1, 2 ... 5] array
const seedArray = Array.from(Array(5).keys());

/**
 * @private
 */
export const mockChatThreads: ChatThreadItem[] = seedArray.map((seed) => ({
  id: 'chatThreadId' + seed,
  topic: 'topic' + seed,
  createdOn: new Date(seed * 10000),
  createdBy: { communicationUserId: 'user' + seed }
}));

const emptyAsyncFunctionWithResponse = async (): Promise<any> => {
  return { _response: {} as any };
};
