// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatClientState, ChatErrors } from '@internal/chat-stateful-client';
import { ChatMessageReadReceipt, ChatParticipant } from '@azure/communication-chat';
import { TypingIndicatorReceivedEvent } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  getUserId,
  getDisplayName,
  getChatMessages,
  getParticipants,
  getReadReceipts,
  getIsLargeGroup,
  getLatestReadTime,
  getTypingIndicators,
  getLatestErrors,
  ChatBaseSelectorProps
} from './baseSelectors';

interface CustomError extends Error {
  statusCode?: number;
}

describe('baseSelectors tests when client state is set', () => {
  const mockState: ChatClientState = {
    userId: { communicationUserId: 'user1', kind: 'communicationUser' },
    displayName: 'User One',
    threads: {
      thread1: {
        threadId: 'thread1',
        chatMessages: {
          msg1: {
            id: 'msg1',
            content: { message: 'Hello' },
            status: 'seen',
            type: 'text',
            createdOn: new Date('2021-01-01T00:00:00Z'),
            sequenceId: '1',
            version: '1'
          }
        },
        participants: { user1: { id: { communicationUserId: 'user1' } } as ChatParticipant },
        readReceipts: [{ chatMessageId: 'msg1', sender: { communicationUserId: 'user1' } } as ChatMessageReadReceipt],
        latestReadTime: new Date('2021-01-01T00:00:00Z'),
        typingIndicators: [
          { sender: { communicationUserId: 'user1' }, receivedOn: new Date() } as TypingIndicatorReceivedEvent
        ]
      }
    },
    latestErrors: {
      'ChatThreadClient.listMessages': {
        innerError: { statusCode: 400, message: 'Test error message' } as CustomError,
        timestamp: new Date(1),
        target: 'ChatThreadClient.listMessages',
        name: 'TestError',
        message: ''
      }
    } as ChatErrors
  };

  const mockProps: ChatBaseSelectorProps = { threadId: 'thread1' };

  test('should get userId', () => {
    expect(getUserId(mockState)).toBe(toFlatCommunicationIdentifier(mockState.userId));
  });

  test('should get displayName', () => {
    expect(getDisplayName(mockState)).toBe(mockState.displayName);
  });

  test('should get chatMessages', () => {
    expect(getChatMessages(mockState, mockProps)).toEqual(mockState.threads.thread1?.chatMessages);
  });

  test('should get participants', () => {
    expect(getParticipants(mockState, mockProps)).toEqual(mockState.threads.thread1?.participants);
  });

  test('should get readReceipts', () => {
    expect(getReadReceipts(mockState, mockProps)).toEqual(mockState.threads.thread1?.readReceipts);
  });

  test('should get isLargeGroup', () => {
    expect(getIsLargeGroup(mockState, mockProps)).toBe(false);
  });

  test('should get latestReadTime', () => {
    expect(getLatestReadTime(mockState, mockProps)).toEqual(mockState.threads.thread1?.latestReadTime);
  });

  test('should get typingIndicators', () => {
    expect(getTypingIndicators(mockState, mockProps)).toEqual(mockState.threads.thread1?.typingIndicators);
  });

  test('should get latestErrors', () => {
    expect(getLatestErrors(mockState)).toEqual(mockState.latestErrors);
  });
});

describe('baseSelectors thread tests when thread is not set', () => {
  const mockState: ChatClientState = {
    userId: { communicationUserId: 'user1', kind: 'communicationUser' },
    displayName: 'User One',
    threads: {},
    latestErrors: {} as ChatErrors
  };

  const mockProps: ChatBaseSelectorProps = { threadId: 'threadId' };

  test('should get empty chatMessages', () => {
    expect(getChatMessages(mockState, mockProps)).toEqual({});
  });

  test('should get empty participants', () => {
    expect(getParticipants(mockState, mockProps)).toEqual({});
  });

  test('should get empty readReceipts', () => {
    expect(getReadReceipts(mockState, mockProps)).toBeUndefined();
  });

  test('should get empty latestReadTime', () => {
    expect(getLatestReadTime(mockState, mockProps)).toEqual(new Date(0));
  });

  test('should get empty typingIndicators', () => {
    expect(getTypingIndicators(mockState, mockProps).length).toBe(0);
  });

  test('should get empty latestErrors', () => {
    expect(getLatestErrors(mockState)).toEqual({});
  });
});

describe('baseSelectors thread tests when thread is set but does not match with props one', () => {
  const mockState: ChatClientState = {
    userId: { communicationUserId: 'user1', kind: 'communicationUser' },
    displayName: 'User One',
    threads: {
      thread1: {
        threadId: 'thread1',
        chatMessages: {
          msg1: {
            id: 'msg1',
            content: { message: 'Hello' },
            status: 'seen',
            type: 'text',
            createdOn: new Date('2021-01-01T00:00:00Z'),
            sequenceId: '1',
            version: '1'
          }
        },
        participants: { user1: { id: { communicationUserId: 'user1' } } as ChatParticipant },
        readReceipts: [{ chatMessageId: 'msg1', sender: { communicationUserId: 'user1' } } as ChatMessageReadReceipt],
        latestReadTime: new Date('2021-01-01T00:00:00Z'),
        typingIndicators: [
          { sender: { communicationUserId: 'user1' }, receivedOn: new Date() } as TypingIndicatorReceivedEvent
        ]
      }
    },
    latestErrors: {} as ChatErrors
  };

  const mockProps: ChatBaseSelectorProps = { threadId: 'thread2' };

  test('should get empty chatMessages', () => {
    expect(getChatMessages(mockState, mockProps)).toEqual({});
  });

  test('should get empty participants', () => {
    expect(getParticipants(mockState, mockProps)).toEqual({});
  });

  test('should get empty readReceipts', () => {
    expect(getReadReceipts(mockState, mockProps)).toBeUndefined();
  });

  test('should get empty latestReadTime', () => {
    expect(getLatestReadTime(mockState, mockProps)).toEqual(new Date(0));
  });

  test('should get empty typingIndicators', () => {
    expect(getTypingIndicators(mockState, mockProps).length).toBe(0);
  });

  test('should get empty latestErrors', () => {
    expect(getLatestErrors(mockState)).toEqual({});
  });
});

describe('baseSelectors large group tests', () => {
  const getParticipants = (): { [key: string]: ChatParticipant } => {
    const participants: { [key: string]: ChatParticipant } = {};
    for (let i = 0; i < 21; i++) {
      participants[`user${i}`] = { id: { communicationUserId: `user${i}` } } as ChatParticipant;
    }
    return participants;
  };
  const mockState: ChatClientState = {
    userId: { communicationUserId: 'user1', kind: 'communicationUser' },
    displayName: 'User One',
    threads: {
      thread1: {
        threadId: 'thread1',
        chatMessages: {
          msg1: {
            id: 'msg1',
            content: { message: 'Hello' },
            status: 'seen',
            type: 'text',
            createdOn: new Date('2021-01-01T00:00:00Z'),
            sequenceId: '1',
            version: '1'
          }
        },
        participants: getParticipants(),
        readReceipts: [{ chatMessageId: 'msg1', sender: { communicationUserId: 'user1' } } as ChatMessageReadReceipt],
        latestReadTime: new Date('2021-01-01T00:00:00Z'),
        typingIndicators: [
          { sender: { communicationUserId: 'user1' }, receivedOn: new Date() } as TypingIndicatorReceivedEvent
        ]
      }
    },
    latestErrors: {} as ChatErrors
  };

  const mockProps: ChatBaseSelectorProps = { threadId: 'thread1' };

  test('should get true for isLargeGroup', () => {
    expect(getIsLargeGroup(mockState, mockProps)).toBe(true);
  });
});
