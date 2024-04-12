// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessageWithStatus, ResourceFetchResult } from '@internal/chat-stateful-client';
import { messageThreadSelector } from './messageThreadSelector';
import { ChatAttachment, ChatMessageType, ChatParticipant } from '@azure/communication-chat';

// Make it type safe when messageThreadSelector can return resultFunc property
const messageThreadSelectorResultFunc = (messageThreadSelector as any).resultFunc;

describe('messageThreadSelector tests', () => {
  test('should parse text messages correctly', async (): Promise<void> => {
    const messageText = 'Hello';
    const result = messageThreadSelectorResultFunc(
      '1',
      getChatMessages(messageText, 'text'),
      Date.now(),
      false,
      [],
      getChatParticipants()
    );

    expect(result.messages).toMatchObject([
      {
        content: messageText
      }
    ]);
  });

  test('should parse HTML messages correctly', async (): Promise<void> => {
    const messageText = '<p>Hello</p>';
    const result = messageThreadSelectorResultFunc(
      '1',
      getChatMessages(messageText, 'html'),
      Date.now(),
      false,
      [],
      getChatParticipants()
    );

    expect(result.messages).toMatchObject([
      {
        content: messageText
      }
    ]);
  });

  test('should parse HTML messages with image tag correctly without attachments', async (): Promise<void> => {
    const messageText = '<p>Hello <img alt="image" src="" id="1"></p>';
    const result = messageThreadSelectorResultFunc(
      '1',
      getChatMessages(messageText, 'html'),
      Date.now(),
      false,
      [],
      getChatParticipants()
    );
    expect(result.messages).toMatchObject([
      {
        content: messageText
      }
    ]);
  });

  test('should parse HTML messages with image tag correctly with attachments', async (): Promise<void> => {
    const messageText = '<p>Hello <img alt="image" src="" id="1"></p>';
    const imageContent = 'data:image/png;base64,iVBORw0KGgoAAAA';
    const expectedContent = '<p>Hello <img alt="image" src="' + imageContent + '" id="1"></p>';

    const result = messageThreadSelectorResultFunc(
      '1',
      getChatMessages(messageText, 'html', [{ id: '1', attachmentType: 'image', previewUrl: 'testURL' }], {
        testURL: { sourceUrl: imageContent }
      }),
      Date.now(),
      false,
      [],
      getChatParticipants()
    );
    expect(result.messages).toMatchObject([
      {
        content: expectedContent
      }
    ]);
  });
});

const getChatParticipants = (): { [key: string]: ChatParticipant } => {
  const participants: { [key: string]: ChatParticipant } = {};
  participants['1'] = {
    id: { communicationUserId: '1' },
    displayName: 'User1'
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
