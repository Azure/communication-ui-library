// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessageReadReceipt, ChatThreadClient, ChatParticipant } from '@azure/communication-chat';
import { ChatMessageWithStatus } from '..';
import { createMockIterator } from './createMockIterator';
import { MockCommunicationUserCredential } from './MockCommunicationUserCredential';

const seedArray = [0, 1, 2, 3, 4];

/**
 * @private
 */
export const messageTemplate: ChatMessageWithStatus = {
  id: 'MessageId',
  content: { message: 'MessageContent' },
  clientMessageId: undefined,
  createdOn: new Date(),
  sender: {
    kind: 'communicationUser',
    communicationUserId: 'UserId'
  },
  senderDisplayName: 'User',
  type: 'text',
  sequenceId: '',
  version: '',
  status: 'delivered',
  /* @conditional-compile-remove(data-loss-prevention) */
  policyViolation: false
};

/**
 * @private
 */
export const mockMessages: ChatMessageWithStatus[] = seedArray.map((seed) => ({
  ...messageTemplate,
  id: 'MessageId' + seed,
  content: { message: 'MessageContent' + seed },
  sender: { kind: 'communicationUser', communicationUserId: 'User' + seed }
}));

/**
 * @private
 */
export const participantTemplate: ChatParticipant = {
  id: { communicationUserId: 'id1' },
  displayName: 'user1',
  shareHistoryTime: new Date(0)
};

/**
 * @private
 */
export const mockParticipants: ChatParticipant[] = seedArray.map((seed) => ({
  ...participantTemplate,
  id: { communicationUserId: `id${seed}` },
  displayName: `user${seed}`
}));

/**
 * @private
 */
export const mockReadReceipts: ChatMessageReadReceipt[] = seedArray.map((seed) => ({
  chatMessageId: `id${seed}`,
  readOn: new Date(seed * 10000),
  sender: { kind: 'communicationUser', communicationUserId: `senderid${seed}` }
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

const emptyAsyncFunctionWithResponse = async (): Promise<any> => {
  return { _response: {} as any };
};

/**
 * @private
 */
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
  mockChatThreadClient.updateTopic = emptyAsyncFunctionWithResponse;

  mockChatThreadClient.deleteMessage = emptyAsyncFunctionWithResponse;

  Object.defineProperty(mockChatThreadClient, 'threadId', { value: threadId });
  return mockChatThreadClient;
};
