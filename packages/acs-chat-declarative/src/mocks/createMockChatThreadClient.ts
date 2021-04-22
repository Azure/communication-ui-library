// © Microsoft Corporation. All rights reserved.

import { ChatMessageReadReceipt, ChatThreadClient, ChatParticipant } from '@azure/communication-chat';
import { ChatMessageWithStatus } from '..';
import { createMockIterator } from './createMockIterator';
import { MockCommunicationUserCredential } from './MockCommunicationUserCredential';

const seedArray = [0, 1, 2, 3, 4];

export const messageTemplate: ChatMessageWithStatus = {
  id: 'MessageId',
  content: { message: 'MessageContent' },
  clientMessageId: undefined,
  createdOn: new Date(),
  sender: {
    communicationUserId: 'UserId'
  },
  senderDisplayName: 'User',
  type: 'text',
  sequenceId: '',
  version: '',
  status: 'delivered'
};

export const mockMessages: ChatMessageWithStatus[] = seedArray.map((seed) => ({
  ...messageTemplate,
  id: 'MessageId' + seed,
  content: { message: 'MessageContent' + seed },
  sender: { communicationUserId: 'User' + seed }
}));

export const participantTemplate: ChatParticipant = {
  user: { communicationUserId: 'id1' },
  displayName: 'user1',
  shareHistoryTime: new Date(0)
};

export const mockParticipants: ChatParticipant[] = seedArray.map((seed) => ({
  ...participantTemplate,
  user: { communicationUserId: `id${seed}` },
  displayName: `user${seed}`
}));

export const mockReadReceipts: ChatMessageReadReceipt[] = seedArray.map((seed) => ({
  chatMessageId: `id${seed}`,
  readOn: new Date(seed * 10000),
  sender: { communicationUserId: `senderid${seed}` }
}));

const mockListMessages = (): any => {
  return createMockIterator(mockMessages);
};

const mockListParticipants = (): any => {
  return createMockIterator(mockParticipants);
};

const mockListReadReceipt = (): any => {
  return createMockIterator(mockReadReceipts);
};

jest.mock('@azure/communication-chat');

const emptyAsyncFunctionWithResponse = async (): Promise<any> => {
  return { _response: {} as any };
};

export const createMockChatThreadClient = (threadId: string): ChatThreadClient => {
  const mockChatThreadClient = new ChatThreadClient(threadId, '', new MockCommunicationUserCredential());
  mockChatThreadClient.listMessages = mockListMessages;
  mockChatThreadClient.listParticipants = mockListParticipants;
  mockChatThreadClient.listReadReceipts = mockListReadReceipt;

  mockChatThreadClient.getMessage = async (messageId: string) => {
    const message = mockMessages.find((message) => message.id === messageId);
    if (!message) {
      throw 'cannot find message';
    }
    return { ...message, _response: {} as any };
  };

  mockChatThreadClient.removeParticipant = emptyAsyncFunctionWithResponse;

  mockChatThreadClient.addParticipants = emptyAsyncFunctionWithResponse;

  mockChatThreadClient.sendMessage = async ({ content }) => {
    if (content === 'fail') {
      throw 'receive fail content';
    }
    return { id: 'messageId1', _response: {} as any };
  };

  mockChatThreadClient.updateMessage = emptyAsyncFunctionWithResponse;
  mockChatThreadClient.updateThread = emptyAsyncFunctionWithResponse;

  mockChatThreadClient.deleteMessage = emptyAsyncFunctionWithResponse;

  Object.defineProperty(mockChatThreadClient, 'threadId', { value: threadId });
  return mockChatThreadClient;
};
