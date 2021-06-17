// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatThreadClientState } from 'chat-stateful-client';
import {
  ChatThreadClientOverrides,
  createMockStatefulChatClient,
  StatefulChatClientOverrides
} from '../../../mocks/ChatMocks';
import { AzureCommunicationChatAdapter } from './AzureCommunicationChatAdapter';

const MOCK_THREADID = 'mockThreadId';
const SEND_ERROR = 'send error';
const UNSUBSCRIBE_ERROR = 'unsubscribe error';
const RECEIPT_ERROR = 'receipt error';
const TYPING_ERROR = 'typing error';
const REMOVE_ERROR = 'remove error';
const TOPIC_ERROR = 'topic error';

const THREAD_OVERRIDES: ChatThreadClientOverrides = {
  threadId: MOCK_THREADID
};

const STATEFUL_OVERRIDES: StatefulChatClientOverrides = {
  getState: () => {
    const threads = {};
    threads[MOCK_THREADID] = {} as ChatThreadClientState;
    return {
      userId: { kind: 'communicationUser', communicationUserId: '' },
      threads
    } as ChatClientState;
  }
};

async function createMockAdapterWithErrorListener(
  errorListener: (e: Error) => void,
  statefulOverrides?: StatefulChatClientOverrides,
  threadOverrides?: ChatThreadClientOverrides
): Promise<AzureCommunicationChatAdapter> {
  const statefulChatClient = createMockStatefulChatClient(statefulOverrides, threadOverrides);
  const chatThreadClient = statefulChatClient.getChatThreadClient('');
  const adapter: AzureCommunicationChatAdapter = new AzureCommunicationChatAdapter(
    statefulChatClient,
    chatThreadClient
  );

  adapter.on('error', errorListener);
  return adapter;
}

describe('AzureCommunicationChatAdapter', () => {
  test('emits error event when dispose() throws an error', async () => {
    let error: Error | undefined;
    const errorListener = (e: Error): void => {
      error = e;
    };

    const adapter = await createMockAdapterWithErrorListener(
      errorListener,
      {
        ...STATEFUL_OVERRIDES,
        off: () => {
          throw new Error(UNSUBSCRIBE_ERROR);
        }
      },
      THREAD_OVERRIDES
    );

    adapter.dispose();

    expect(error?.message).toBe(UNSUBSCRIBE_ERROR);
    expect(adapter.getState().error?.message).toBe(UNSUBSCRIBE_ERROR);
  });

  test('emits error event when sendMessage() throws an error', async () => {
    let error: Error | undefined;
    const errorListener = (e: Error): void => {
      error = e;
    };

    const adapter = await createMockAdapterWithErrorListener(errorListener, STATEFUL_OVERRIDES, {
      ...THREAD_OVERRIDES,
      sendMessage: () => {
        throw new Error(SEND_ERROR);
      }
    });
    await adapter.sendMessage('');

    expect(error?.message).toBe(SEND_ERROR);
    expect(adapter.getState().error?.message).toBe(SEND_ERROR);
  });

  test('emits error event when sendReadReceipt() throws an error', async () => {
    let error: Error | undefined;
    const errorListener = (e: Error): void => {
      error = e;
    };

    const adapter = await createMockAdapterWithErrorListener(errorListener, STATEFUL_OVERRIDES, {
      ...THREAD_OVERRIDES,
      sendReadReceipt: () => {
        throw new Error(RECEIPT_ERROR);
      }
    });
    await adapter.sendReadReceipt('');

    expect(error?.message).toBe(RECEIPT_ERROR);
    expect(adapter.getState().error?.message).toBe(RECEIPT_ERROR);
  });

  test('emits error event when sendTypingIndicator() throws an error', async () => {
    let error: Error | undefined;
    const errorListener = (e: Error): void => {
      error = e;
    };

    const adapter = await createMockAdapterWithErrorListener(errorListener, STATEFUL_OVERRIDES, {
      ...THREAD_OVERRIDES,
      sendTypingNotification: () => {
        throw new Error(TYPING_ERROR);
      }
    });
    await adapter.sendTypingIndicator();

    expect(error?.message).toBe(TYPING_ERROR);
    expect(adapter.getState().error?.message).toBe(TYPING_ERROR);
  });

  test('emits error event when removeParticipant() throws an error', async () => {
    let error: Error | undefined;
    const errorListener = (e: Error): void => {
      error = e;
    };

    const adapter = await createMockAdapterWithErrorListener(errorListener, STATEFUL_OVERRIDES, {
      ...THREAD_OVERRIDES,
      removeParticipant: () => {
        throw new Error(REMOVE_ERROR);
      }
    });
    await adapter.removeParticipant('');

    expect(error?.message).toBe(REMOVE_ERROR);
    expect(adapter.getState().error?.message).toBe(REMOVE_ERROR);
  });

  test('emits error event when setTopic() throws an error', async () => {
    let error: Error | undefined;
    const errorListener = (e: Error): void => {
      error = e;
    };

    const adapter = await createMockAdapterWithErrorListener(errorListener, STATEFUL_OVERRIDES, {
      ...THREAD_OVERRIDES,
      updateTopic: () => {
        throw new Error(TOPIC_ERROR);
      }
    });
    await adapter.setTopic('');

    expect(error?.message).toBe(TOPIC_ERROR);
    expect(adapter.getState().error?.message).toBe(TOPIC_ERROR);
  });
});
