// © Microsoft Corporation. All rights reserved.

import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import { ChatContext } from './ChatContext';
import { chatThreadClientDeclaratify } from './ChatThreadClientDeclarative';
import { createMockMessagesIterator } from './TestUtils';

const mockMessages = [
  {
    id: 'MessageId1',
    content: { message: 'MessageContent1' },
    createdOn: new Date(),
    sender: {
      communicationUserId: 'UserId1'
    },
    senderDisplayName: 'User1',
    type: 'text',
    sequenceId: '',
    version: ''
  },
  {
    id: 'MessageId2',
    content: { message: 'MessageContent2' },
    createdOn: new Date(),
    sender: {
      communicationUserId: 'UserId1'
    },
    senderDisplayName: 'User1',
    type: 'text',
    sequenceId: '',
    version: ''
  },
  {
    id: 'MessageId3',
    content: { message: 'MessageContent3' },
    createdOn: new Date(),
    sender: {
      communicationUserId: 'UserId1'
    },
    senderDisplayName: 'User1',
    type: 'text',
    sequenceId: '',
    version: ''
  },
  {
    id: 'MessageId4',
    content: { message: 'MessageContent4' },
    createdOn: new Date(),
    sender: {
      communicationUserId: 'UserId1'
    },
    senderDisplayName: 'User1',
    type: 'text',
    sequenceId: '',
    version: ''
  }
];

const mockListMessages = (): any => {
  return createMockMessagesIterator(mockMessages);
};

jest.mock('@azure/communication-chat');

const threadId = '1';

class MockCommunicationUserCredential {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getToken(): any {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}
}

function createMockChatClientAndDeclaratify(context: ChatContext): ChatThreadClient {
  const mockChatThreadClient = new ChatThreadClient(threadId, '', new MockCommunicationUserCredential());
  mockChatThreadClient.listMessages = mockListMessages;
  Object.defineProperty(mockChatThreadClient, 'threadId', { value: threadId });
  const declarativeChatThreadClient = chatThreadClientDeclaratify(mockChatThreadClient, context);
  return declarativeChatThreadClient;
}

describe('declarative listMessage', () => {
  test('declarative listMessage should proxy listMessages iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const messages = createMockChatClientAndDeclaratify(context).listMessages();
    const proxiedMessages: ChatMessage[] = [];
    for await (const message of messages) {
      proxiedMessages.push(message);
    }
    expect(proxiedMessages.length).toBe(mockMessages.length);
    expect(context.getState().threads.get(threadId)?.chatMessages.size).toBe(mockMessages.length);
  });

  test('declarative listMessage should proxy listMessages paged iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const pages = createMockChatClientAndDeclaratify(context).listMessages().byPage();
    const proxiedMessages: ChatMessage[] = [];
    for await (const page of pages) {
      for (const message of page) {
        proxiedMessages.push(message);
      }
    }
    expect(proxiedMessages.length).toBe(mockMessages.length);
    expect(context.getState().threads.get(threadId)?.chatMessages.size).toBe(mockMessages.length);
  });
});
