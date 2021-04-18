// © Microsoft Corporation. All rights reserved.

import { ChatClientMock, createChatClient } from '../mocks/ChatClientMocks';
import {
  TypingNotification,
  TypingNotifications,
  useSubscribeTypingNotification
} from './useSubscribeTypingNotification';
import { act, renderHook } from '@testing-library/react-hooks';

import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling-2';

let chatClientMock: ChatClientMock;

// Need an extra function start with mock to pass out the variable and lazily create mock
// to byPass the restrcition of jest: `jest.mock()` is not allowed to reference any out-of-scope variables.
const mockChatClient = (): ChatClientMock => {
  chatClientMock = createChatClient();
  return chatClientMock;
};

jest.mock('../providers/ChatProviderHelper', () => {
  return {
    useChatClient: jest.fn().mockImplementation(
      (): ChatClientMock => {
        return mockChatClient();
      }
    )
  };
});

const typingNotification: TypingNotification = {
  from: 'Test User',
  originalArrivalTime: 1577865600000, // number of Date '01-01-2020'
  recipientId: 'testId',
  threadId: 'testThreadId',
  version: '1'
};

const typingIndicatorEvent: TypingIndicatorReceivedEvent = {
  version: typingNotification.version,
  receivedOn: new Date(1577865600000).toUTCString(),
  threadId: typingNotification.threadId,
  sender: {
    user: { communicationUserId: typingNotification.from },
    displayName: 'User1'
  },
  recipient: {
    communicationUserId: typingNotification.recipientId
  }
};

describe('useSubscribeTypingNotification tests', () => {
  afterEach(() => {
    chatClientMock.reset();
  });
  test('should be able to subscribe typingIndicatorReceived', async (): Promise<void> => {
    let notifications: TypingNotifications = {};
    const expectNotifications = { [typingNotification.from]: typingNotification };
    const mockAddNotifications = jest.fn((notification: TypingNotification) => {
      notifications = { ...notifications, [notification.from]: notification };
    });

    await act(async () => {
      renderHook(() => useSubscribeTypingNotification(mockAddNotifications));
    });
    await chatClientMock.triggerEvent('typingIndicatorReceived', typingIndicatorEvent);

    expect(expectNotifications).toMatchObject(notifications);
  });
});
