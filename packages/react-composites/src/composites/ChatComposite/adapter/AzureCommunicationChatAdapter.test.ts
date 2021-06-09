// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatThreadClientState } from 'chat-stateful-client';
import { waitWithBreakCondition } from '../../../mocks';
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
  threadId: MOCK_THREADID,
  sendMessage: () => {
    throw new Error(SEND_ERROR);
  },
  sendReadReceipt: () => {
    throw new Error(RECEIPT_ERROR);
  },
  sendTypingNotification: () => {
    throw new Error(TYPING_ERROR);
  },
  removeParticipant: () => {
    throw new Error(REMOVE_ERROR);
  },
  updateTopic: () => {
    throw new Error(TOPIC_ERROR);
  }
};

const STATEFUL_OVERRIDES: StatefulChatClientOverrides = {
  getState: () => {
    const threads = new Map<string, ChatThreadClientState>();
    threads.set(MOCK_THREADID, {} as ChatThreadClientState);
    return {
      userId: { kind: 'communicationUser', communicationUserId: '' },
      threads
    } as ChatClientState;
  },
  off: () => {
    throw new Error(UNSUBSCRIBE_ERROR);
  }
};

describe('AzureCommunicationChatAdapter', () => {
  test('emits error event when error happens', async () => {
    let error: Error | undefined;
    const errorListener = (e: Error): void => {
      error = e;
    };

    const statefulChatClient = createMockStatefulChatClient(STATEFUL_OVERRIDES, THREAD_OVERRIDES);
    const chatThreadClient = statefulChatClient.getChatThreadClient('');
    const adapter: AzureCommunicationChatAdapter = new AzureCommunicationChatAdapter(
      statefulChatClient,
      chatThreadClient
    );

    adapter.on('error', errorListener);

    adapter.dispose();

    await waitWithBreakCondition(() => error !== undefined);

    expect(error?.message).toBe(UNSUBSCRIBE_ERROR);
    expect(adapter.getState().error?.message).toBe(UNSUBSCRIBE_ERROR);

    await adapter.sendMessage('');

    expect(error?.message).toBe(SEND_ERROR);
    expect(adapter.getState().error?.message).toBe(SEND_ERROR);

    await adapter.sendReadReceipt('');

    expect(error?.message).toBe(RECEIPT_ERROR);
    expect(adapter.getState().error?.message).toBe(RECEIPT_ERROR);

    await adapter.sendTypingIndicator();

    expect(error?.message).toBe(TYPING_ERROR);
    expect(adapter.getState().error?.message).toBe(TYPING_ERROR);

    await adapter.removeParticipant('');

    expect(error?.message).toBe(REMOVE_ERROR);
    expect(adapter.getState().error?.message).toBe(REMOVE_ERROR);

    await adapter.setTopic('');

    expect(error?.message).toBe(TOPIC_ERROR);
    expect(adapter.getState().error?.message).toBe(TOPIC_ERROR);
  });
});
