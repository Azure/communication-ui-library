// © Microsoft Corporation. All rights reserved.

import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { createDeclarativeChatThreadClient } from './Prototype';

const mockMessages = [
  {
    id: 'MessageId1',
    content: 'MessageContent1',
    createdOn: new Date(),
    sender: {
      communicationUserId: 'UserId1'
    },
    senderDisplayName: 'User1'
  },
  {
    id: 'MessageId2',
    content: 'MessageContent2',
    createdOn: new Date(),
    sender: {
      communicationUserId: 'UserId1'
    },
    senderDisplayName: 'User1'
  },
  {
    id: 'MessageId3',
    content: 'MessageContent3',
    createdOn: new Date(),
    sender: {
      communicationUserId: 'UserId1'
    },
    senderDisplayName: 'User1'
  },
  {
    id: 'MessageId4',
    content: 'MessageContent4',
    createdOn: new Date(),
    sender: {
      communicationUserId: 'UserId1'
    },
    senderDisplayName: 'User1'
  }
];

const createMockMessagesIterator = (): any => {
  let i = 0;
  const end = mockMessages.length;
  return {
    next() {
      if (i < end) {
        const iteration = Promise.resolve({ value: mockMessages[i], done: false });
        i++;
        return iteration;
      } else {
        return Promise.resolve({ done: true });
      }
    },
    [Symbol.asyncIterator]() {
      return this;
    },
    byPage() {
      let i = 0;
      const end = mockMessages.length;
      // Hardcode page size this since its just for test purposes
      const pageSize = 2;
      return {
        next() {
          if (i < end) {
            const page: ChatMessage[] = [];
            for (let j = 0; j < pageSize; j++) {
              if (i >= end) {
                break;
              }
              page.push(mockMessages[i]);
              i++;
            }
            return Promise.resolve({ value: page, done: false });
          } else {
            return Promise.resolve({ done: true });
          }
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
  };
};

const mockListMessages = (): any => {
  return createMockMessagesIterator();
};

jest.mock('@azure/communication-common');
jest.mock('@azure/communication-chat');

describe('declarative listMessage', () => {
  test('declarative listMessage should proxy listMessages iterator and store it in internal state', async () => {
    const mockChatThreadClient = new ChatThreadClient('', '', new AzureCommunicationUserCredential(''));
    mockChatThreadClient.listMessages = mockListMessages;
    const declarativeChatThreadClient = createDeclarativeChatThreadClient(mockChatThreadClient);
    const messages = declarativeChatThreadClient.listMessages();
    const proxiedMessages: ChatMessage[] = [];
    for await (const message of messages) {
      proxiedMessages.push(message);
    }
    expect(proxiedMessages.length).toBe(mockMessages.length);
    expect(declarativeChatThreadClient.getState().chatMessages.size).toBe(mockMessages.length);
  });

  test('declarative listMessage should proxy listMessages paged iterator and store it in internal state', async () => {
    const mockChatThreadClient = new ChatThreadClient('', '', new AzureCommunicationUserCredential(''));
    mockChatThreadClient.listMessages = mockListMessages;
    const declarativeChatThreadClient = createDeclarativeChatThreadClient(mockChatThreadClient);
    const pages = declarativeChatThreadClient.listMessages().byPage();
    const proxiedMessages: ChatMessage[] = [];
    for await (const page of pages) {
      for (const message of page) {
        proxiedMessages.push(message);
      }
    }
    expect(proxiedMessages.length).toBe(mockMessages.length);
    expect(declarativeChatThreadClient.getState().chatMessages.size).toBe(mockMessages.length);
  });
});
