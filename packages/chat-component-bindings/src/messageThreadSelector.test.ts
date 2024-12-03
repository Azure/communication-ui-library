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
/* @conditional-compile-remove(data-loss-prevention) */
import { DEFAULT_DATA_LOSS_PREVENTION_POLICY_URL } from './utils/constants';
import { v4 as uuidv4 } from 'uuid';

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

  test('should not return deleted messages', async (): Promise<void> => {
    const messageText = '<p>Hello</p>';
    const expectedType = 'html';
    const messages: { [key: string]: ChatMessageWithStatus } = {};
    messages['0'] = {
      id: '0',
      clientMessageId: '0',
      sequenceId: '0',
      status: 'delivered',
      type: expectedType,
      version: '1',
      createdOn: new Date(1),
      content: {
        message: messageText
      },
      deletedOn: new Date(2)
    };
    const participants = getChatParticipants();
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages.length).toBe(0);
    expect(result.userId).toBe(userId);
    expect('participantCount' in result && result.participantCount).toBe(Object.keys(participants).length);
    expect('readReceiptsBySenderId' in result && result.readReceiptsBySenderId).toEqual({
      '2': { lastReadMessage: '0', displayName: 'User2' }
    });
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse messages with empty metadata', async (): Promise<void> => {
    const messageText = 'Hello';
    const expectedType = 'text';
    const participants = getChatParticipants();
    const metadata = {};
    const messages = getChatMessages(messageText, expectedType, undefined, undefined, undefined, undefined, metadata);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: messageText,
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

describe('messageThreadSelector system message tests', () => {
  test('should parse participantAdded messages correctly', async (): Promise<void> => {
    const expectedType = 'participantAdded';
    const participants = getChatParticipants();
    const participantsArray = Object.values(participants);
    const messages = getChatMessages('Participant added', expectedType, undefined, undefined, participantsArray);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages).toMatchObject([
      {
        messageType: 'system',
        messageId: message?.id,
        createdOn: message?.createdOn,
        systemMessageType: expectedType,
        iconName: 'PeopleAdd',
        participants: [
          { userId: '1', displayName: 'User1' },
          { userId: '2', displayName: 'User2' }
        ]
      }
    ]);
    expect(result.userId).toBe(userId);
    expect('participantCount' in result && result.participantCount).toBe(Object.keys(participants).length);
    expect('readReceiptsBySenderId' in result && result.readReceiptsBySenderId).toEqual({
      '2': { lastReadMessage: '0', displayName: 'User2' }
    });
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse participantRemoved messages correctly', async (): Promise<void> => {
    const expectedType = 'participantRemoved';
    const participants = getChatParticipants();
    const participantsArray = Object.values(participants);
    const messages = getChatMessages('Participant removed', expectedType, undefined, undefined, participantsArray);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, {}), mockProps);
    expect(result.messages).toMatchObject([
      {
        messageType: 'system',
        messageId: message?.id,
        createdOn: message?.createdOn,
        systemMessageType: expectedType,
        iconName: 'PeopleBlock',
        participants: [
          { userId: '1', displayName: 'User1' },
          { userId: '2', displayName: 'User2' }
        ]
      }
    ]);
    expect(result.userId).toBe(userId);
    expect('participantCount' in result && result.participantCount).toBe(0);
    expect('readReceiptsBySenderId' in result && result.readReceiptsBySenderId).toEqual({
      '2': { lastReadMessage: '0', displayName: '' }
    });
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse topicUpdated messages correctly', async (): Promise<void> => {
    const expectedType = 'topicUpdated';
    const text = 'New topic';
    const participants = getChatParticipants();
    const messages = getChatMessages('Topic updated', expectedType, undefined, undefined, undefined, text);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages).toMatchObject([
      {
        messageType: 'system',
        messageId: message?.id,
        createdOn: message?.createdOn,
        systemMessageType: expectedType,
        iconName: 'Edit',
        topic: text
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
  test('should parse attachments from metadata', async (): Promise<void> => {
    const messageText = 'Hello';
    const expectedType = 'text';
    const participants = getChatParticipants();
    const file = { name: 'SampleFile1.pdf', extension: 'pdf', attachmentType: 'file', id: uuidv4(), url: 'testURL' };
    const metadata = {
      fileSharingMetadata: JSON.stringify([file])
    };
    const messages = getChatMessages(messageText, expectedType, undefined, undefined, undefined, undefined, metadata);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: messageText,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn,
        attachments: [
          {
            id: file.id,
            name: file.name,
            url: file.url
          }
        ]
      }
    ]);
    expect(result.userId).toBe(userId);
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse file attachments from attachments', async (): Promise<void> => {
    const messageText = 'Hello';
    const expectedType = 'text';
    const participants = getChatParticipants();
    const attachment: ChatAttachment = {
      id: '1',
      attachmentType: 'file',
      previewUrl: 'testURL',
      name: 'SampleFile1.pdf'
    };
    const messages = getChatMessages(messageText, expectedType, [attachment]);
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: messageText,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn,
        attachments: [
          {
            id: attachment.id,
            name: attachment.name,
            url: attachment.previewUrl
          }
        ]
      }
    ]);
    expect(result.userId).toBe(userId);
    expect(result.showMessageStatus).toBe(true);
  });

  test('should return file attachments from message attachments and metadata', async (): Promise<void> => {
    const messageText = 'Hello';
    const expectedType = 'text';
    const participants = getChatParticipants();
    const attachment: ChatAttachment = {
      id: '1',
      attachmentType: 'file',
      previewUrl: 'testURL',
      name: 'SampleFile1.pdf'
    };
    const file = { name: 'SampleFile1.pdf', extension: 'pdf', attachmentType: 'file', id: uuidv4(), url: 'testURL' };
    const metadata = {
      fileSharingMetadata: JSON.stringify([file])
    };
    const messages = getChatMessages(
      messageText,
      expectedType,
      [attachment],
      undefined,
      undefined,
      undefined,
      metadata
    );
    const message = messages['0'];
    const result = messageThreadSelector(getChatClientState(messages, participants), mockProps);
    expect(result.messages).toMatchObject([
      {
        content: messageText,
        messageType: 'chat',
        contentType: expectedType,
        messageId: message?.id,
        clientMessageId: message?.clientMessageId,
        status: message?.status,
        createdOn: message?.createdOn,
        attachments: [
          {
            id: file.id,
            name: file.name,
            url: file.url
          },
          {
            id: attachment.id,
            name: attachment.name,
            url: attachment.previewUrl
          }
        ]
      }
    ]);
    expect(result.userId).toBe(userId);
    expect(result.showMessageStatus).toBe(true);
  });
});

describe('messageThreadSelector inline images tests', () => {
  test('should parse HTML messages with image tag without attachments correctly', async (): Promise<void> => {
    const messageText = '<p>Hello <img alt="image" src="" id="1"></p>';
    const expectedType = 'html';
    const participants = getChatParticipants();
    const messages = getChatMessages(messageText, expectedType);
    const message = messages['0'];
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
    expect(result.showMessageStatus).toBe(true);
  });

  test('should parse HTML messages with image tag and attachments ', async (): Promise<void> => {
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

  test('should add itemscope to image tag for a message without image tag in content when image attachments present with extension in the name', async (): Promise<void> => {
    const messageText = '<p>Hello</p>';
    const imageContent = 'data:image/png;base64,iVBORw0KGgoAAAA';
    const expectedContent =
      '<p>Hello</p>\r\n<p><img alt="image" src="' + imageContent + '" itemscope="png" id="1"></p>';

    const expectedType = 'html';
    const attachments: ChatAttachment[] = [
      { id: '1', attachmentType: 'image', previewUrl: 'testURL', name: 'image.png' }
    ];
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

  test('should not include itemscope for a message without image tag in content when image attachments present', async (): Promise<void> => {
    const messageText = '<p>Hello</p>';
    const imageContent = 'data:image/png;base64,iVBORw0KGgoAAAA';
    const expectedContent = '<p>Hello</p>\r\n<p><img alt="image" src="' + imageContent + '" itemscope="" id="1"></p>';

    const expectedType = 'html';
    const attachments: ChatAttachment[] = [{ id: '1', attachmentType: 'image', previewUrl: 'testURL', name: 'image' }];
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

  test('should not include image information in content when image attachments present but no preview url or image tag in content ', async (): Promise<void> => {
    const messageText = '<p>Hello</p>';
    const imageContent = 'data:image/png;base64,iVBORw0KGgoAAAA';
    const expectedType = 'html';
    const attachments: ChatAttachment[] = [{ id: '1', attachmentType: 'image', name: 'image.png' }];
    const resourceCache: Record<string, ResourceFetchResult> = {
      testURL: { sourceUrl: imageContent }
    };
    const messages = getChatMessages(messageText, expectedType, attachments, resourceCache);
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
  resourceCache?: Record<string, ResourceFetchResult>,
  participants?: ChatParticipant[],
  topic?: string,
  metadata?: Record<string, string>
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
      attachments,
      participants,
      topic
    },
    resourceCache: resourceCache,
    metadata
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
