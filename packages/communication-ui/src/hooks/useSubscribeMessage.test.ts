// © Microsoft Corporation. All rights reserved.

import { ChatClientMock, createChatClient } from '../mocks/ChatClientMocks';
import { ChatMessage } from '@azure/communication-chat';
import { act, renderHook } from '@testing-library/react-hooks';

import { ChatMessageReceivedEvent } from '@azure/communication-signaling-2/types/src/events/chat';
import { useSubscribeMessage } from './useSubscribeMessage';

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

jest.mock('../providers/ChatProvider', () => {
  return {
    useUserId: () => 'dummyValueNotUsedByTest'
  };
});

jest.mock('../providers/ChatThreadProvider', () => {
  return {
    useSetChatMessages: () => () => {
      return;
    },
    useThreadId: () => 'ThreadId'
  };
});

const mockMessage: ChatMessage = {
  content: { message: 'mockContent' },
  id: 'mockId',
  createdOn: new Date('2020-10-23T05:25:44.927Z'),
  sender: { communicationUserId: 'mockSenderCommunicationUserId' },
  senderDisplayName: 'mockSenderDisplayName',
  type: 'Text',
  version: 'mockVersion',
  sequenceId: ''
};

const mockMessageEvent: ChatMessageReceivedEvent = {
  content: 'mockContent',
  createdOn: '2020-10-23T05:25:44.927Z',
  id: 'mockId',
  recipient: { communicationUserId: 'mockRecipientCommunicationUserId' },
  sender: { user: { communicationUserId: 'mockSenderCommunicationUserId' }, displayName: '' },
  threadId: 'mockThreadId',
  type: 'Text',
  version: 'mockVersion'
};

describe('useSubscribeMessage tests', () => {
  afterEach(() => {
    chatClientMock.reset();
  });
  test('should be able to subscribe chatMessageReceived', async (): Promise<void> => {
    let messages: ChatMessage[] = [];
    const expectMessages = [mockMessage];
    const mockAddMessage = jest.fn((messageEvent: ChatMessageReceivedEvent) => {
      const { threadId: _threadId, recipient: _recipient, ...newMessage } = {
        ...messageEvent,
        sender: { communicationUserId: messageEvent.sender.user.communicationUserId },
        content: { message: messageEvent.content },
        createdOn: new Date(messageEvent.createdOn),
        sequenceId: ''
      };
      messages = [...messages, newMessage];
    });

    await act(async () => {
      renderHook(() => useSubscribeMessage(mockAddMessage));
    });
    await chatClientMock.triggerEvent('chatMessageReceived', mockMessageEvent);

    expect(expectMessages).toMatchObject(messages);
  });
});
