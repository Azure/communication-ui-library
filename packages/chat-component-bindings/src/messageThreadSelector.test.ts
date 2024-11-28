// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  ChatClientState,
  ChatErrors,
  ChatMessageWithStatus,
  ResourceFetchResult
} from '@internal/chat-stateful-client';
import { messageThreadSelector } from './messageThreadSelector';
import {
  ChatAttachment,
  ChatMessageReadReceipt,
  ChatMessageType,
  ChatParticipant,
  TypingIndicatorReceivedEvent
} from '@azure/communication-chat';
import { ChatBaseSelectorProps } from './baseSelectors';
import { DEFAULT_DATA_LOSS_PREVENTION_POLICY_URL } from './utils/constants';

const userId = 'user1';
const mockProps: ChatBaseSelectorProps = { threadId: 'thread1' };

describe('messageThreadSelector tests', () => {
  test('should parse text messages correctly', async (): Promise<void> => {
    const messageText = 'Hello';
    const expectedType = 'text';
    const messages = getChatMessages(messageText, expectedType);
    const message = messages['0'];
    const participants = getChatParticipants();
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: message?.content?.message,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn
      }
    ]);
    expect(result.userId).toBe(userId);
    expect('participantCount' in result && result.participantCount).toBe(Object.keys(participants).length);
    expect('readReceiptsBySenderId' in result && result.readReceiptsBySenderId).toEqual({
      '2': { lastReadMessage: '0', displayName: 'User2' }
    });
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse HTML messages correctly in ACS chat', async (): Promise<void> => {
    const messageText = '<p>Hello</p>';
    const expectedType = 'html';
    const messages = getChatMessages(messageText, expectedType);
    const message = messages['0'];
    const participants = getChatParticipants();
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: messageText,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn
      }
    ]);
    expect(result.userId).toBe(userId);
    expect('participantCount' in result && result.participantCount).toBe(Object.keys(participants).length);
    expect('readReceiptsBySenderId' in result && result.readReceiptsBySenderId).toEqual({
      '2': { lastReadMessage: '0', displayName: 'User2' }
    });
    expect(result.showMessageStatus).toBe(true);
  });

  /* @conditional-compile-remove(data-loss-prevention) */
  test('should parse blocked messages correctly', async (): Promise<void> => {
    const messageText = 'Hello';
    const expectedType = 'text';
    const message: ChatMessageWithStatus = {
      id: '0',
      clientMessageId: '0',
      sequenceId: '0',
      status: 'delivered',
      type: expectedType,
      version: '1',
      createdOn: new Date(),
      content: {
        message: messageText
      },
      policyViolation: {
        result: 'contentBlocked'
      }
    };
    const messages: { [key: string]: ChatMessageWithStatus } = { '0': message };
    const participants = getChatParticipants();
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages).toMatchObject([
      {
        createdOn: message?.createdOn,
        warningText: undefined,
        status: message?.status,
        senderDisplayName: message.senderDisplayName,
        messageId: message?.id,
        messageType: 'blocked',
        link: DEFAULT_DATA_LOSS_PREVENTION_POLICY_URL
      }
    ]);
    expect(result.userId).toBe(userId);
    expect('participantCount' in result && result.participantCount).toBe(Object.keys(participants).length);
    expect('readReceiptsBySenderId' in result && result.readReceiptsBySenderId).toEqual({
      '2': { lastReadMessage: '0', displayName: 'User2' }
    });
    expect(result.showMessageStatus).toBe(true);
  });
});

describe('messageThreadSelector attachments tests', () => {
  test('should parse HTML messages with image tag without attachments correctly', async (): Promise<void> => {
    const messageText = '<p>Hello <img alt="image" src="" id="1"></p>';
    const expectedType = 'html';
    const messages = getChatMessages(messageText, expectedType);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, getChatParticipants()), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: messageText,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn
      }
    ]);
    expect(result.userId).toBe(userId);
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse HTML messages with image tag and attachments correctly ', async (): Promise<void> => {
    const messageText = '<p>Hello <img alt="image" src="" id="1"></p>';
    const imageContent = 'data:image/png;base64,iVBORw0KGgoAAAA';
    const expectedContent = '<p>Hello <img alt="image" src="' + imageContent + '" id="1"></p>';

    const expectedType = 'html';
    const attachments: ChatAttachment[] = [{ id: '1', attachmentType: 'image', previewUrl: 'testURL' }];
    const resourceCache: Record<string, ResourceFetchResult> = {
      testURL: { sourceUrl: imageContent }
    };
    const messages = getChatMessages(messageText, expectedType, attachments, resourceCache);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, getChatParticipants()), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: expectedContent,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn,
        attachments: undefined
      }
    ]);
    expect(result.userId).toBe(userId);
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse image tag to broken image when image attachments has no image source', async (): Promise<void> => {
    const messageText = '<p>Hello <img alt="image" src="" id="1"></p>';
    const expectedContent =
      '<p>Hello <div alt="image" src="" id="1" class="broken-image-wrapper" data-ui-id="broken-image-icon"></div></p>';

    const expectedType = 'html';
    const attachments: ChatAttachment[] = [{ id: '1', attachmentType: 'image', previewUrl: 'testURL' }];
    const resourceCache: Record<string, ResourceFetchResult> = {
      testURL: { error: new Error('Failed to fetch image') }
    };
    const messages = getChatMessages(messageText, expectedType, attachments, resourceCache);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, getChatParticipants()), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: expectedContent,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn,
        attachments: undefined
      }
    ]);
    expect(result.userId).toBe(userId);
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse HTML messages without image tag correctly when image attachments present', async (): Promise<void> => {
    const messageText = '<p>Hello</p>';
    const imageContent = 'data:image/png;base64,iVBORw0KGgoAAAA';
    const expectedContent = '<p>Hello</p>\r\n<p><img alt="image" src="' + imageContent + '" itemscope="" id="1"></p>';

    const expectedType = 'html';
    const attachments: ChatAttachment[] = [{ id: '1', attachmentType: 'image', previewUrl: 'testURL' }];
    const resourceCache: Record<string, ResourceFetchResult> = {
      testURL: { sourceUrl: imageContent }
    };
    const messages = getChatMessages(messageText, expectedType, attachments, resourceCache);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, getChatParticipants()), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: expectedContent,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn,
        attachments: undefined
      }
    ]);
    expect(result.userId).toBe(userId);
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse image attachments without image tags and no image source', async (): Promise<void> => {
    const messageText = '<p>Hello</p>';
    const expectedContent =
      '<p>Hello</p>\r\n<p><div class="broken-image-wrapper" data-ui-id="broken-image-icon"></div></p>';

    const expectedType = 'html';
    const attachments: ChatAttachment[] = [{ id: '1', attachmentType: 'image', previewUrl: 'testURL' }];
    const resourceCache: Record<string, ResourceFetchResult> = {
      testURL: { error: new Error('Failed to fetch image') }
    };
    const messages = getChatMessages(messageText, expectedType, attachments, resourceCache);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, getChatParticipants()), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: expectedContent,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn,
        attachments: undefined
      }
    ]);
    expect(result.userId).toBe(userId);
    expect(result.showMessageStatus).toBe(true);
  });
});

const getChatParticipants = (): { [key: string]: ChatParticipant } => {
  const participants: { [key: string]: ChatParticipant } = {};
  participants['1'] = {
    id: { communicationUserId: '1' },
    displayName: 'User1'
  };
  participants['2'] = {
    id: { communicationUserId: '2' },
    displayName: 'User2'
  };
  return participants;
};

const getChatMessages = (
  messageText: string,
  type: ChatMessageType,
  attachments?: ChatAttachment[],
  resourceCache?: Record<string, ResourceFetchResult>
): { [key: string]: ChatMessageWithStatus } => {
  const chatMessages: { [key: string]: ChatMessageWithStatus } = {};
  chatMessages['0'] = {
    id: '0',
    clientMessageId: '0',
    sequenceId: '0',
    status: 'delivered',
    type: type,
    version: '1',
    createdOn: new Date(),
    content: {
      message: messageText,
      attachments: attachments
    },
    resourceCache: resourceCache
  };
  return chatMessages;
};

const getChatClientState = (
  chatMessages: { [key: string]: ChatMessageWithStatus },
  participants: {
    [key: string]: ChatParticipant;
  }
): ChatClientState => {
  return {
    userId: { communicationUserId: userId, kind: 'communicationUser' },
    displayName: 'User One',
    threads: {
      thread1: {
        threadId: 'thread1',
        chatMessages,
        participants,
        readReceipts: [{ chatMessageId: '0', sender: { communicationUserId: '2' } } as ChatMessageReadReceipt],
        latestReadTime: new Date('2021-01-01T00:00:00Z'),
        typingIndicators: [
          { sender: { communicationUserId: 'user1' }, receivedOn: new Date() } as TypingIndicatorReceivedEvent
        ]
      }
    },
    latestErrors: {} as ChatErrors
  };
};
