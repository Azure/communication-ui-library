// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ChatMessage, CustomMessage, Message } from '@internal/react-components';
import { updateMessagesWithAttached } from './updateMessagesWithAttached';

const cannedChatMessage = (senderId: string): ChatMessage => ({
  messageType: 'chat',
  senderId,
  contentType: 'text',
  createdOn: new Date(),
  messageId: ''
});

const cannedCustomMessage = (): CustomMessage => ({
  messageType: 'custom',
  content: '',
  createdOn: new Date(),
  messageId: ''
});

const getAttachedStatusArray = (messages: Message[]) => {
  return messages.map((message) => (message.messageType === 'chat' ? message.attached : undefined));
};

describe('update message with attached status', () => {
  test('Set right status for attached property for 1 message', () => {
    const oneMessageArray: Message[] = [cannedChatMessage('1')];

    updateMessagesWithAttached(oneMessageArray, '1');
    expect(getAttachedStatusArray(oneMessageArray)).toEqual([false]);
  });

  test('Set right status for attached property for 3 messages', () => {
    const threeMessagesArray = [cannedChatMessage('1'), cannedChatMessage('1'), cannedChatMessage('2')];

    updateMessagesWithAttached(threeMessagesArray, '1');
    expect(getAttachedStatusArray(threeMessagesArray)).toEqual(['top', 'bottom', false]);
  });

  test('Set right status for attached property for messages from different users', () => {
    const fiveMessagesArray = [
      cannedChatMessage('2'),
      cannedChatMessage('1'),
      cannedChatMessage('1'),
      cannedChatMessage('1'),
      cannedChatMessage('2')
    ];

    updateMessagesWithAttached(fiveMessagesArray, '1');
    expect(getAttachedStatusArray(fiveMessagesArray)).toEqual([false, 'top', true, 'bottom', false]);
  });

  test('Set right status for attached property for different types of messages', () => {
    const messagesArrayWithOtherMessage = [cannedChatMessage('1'), cannedCustomMessage(), cannedChatMessage('1')];

    updateMessagesWithAttached(messagesArrayWithOtherMessage, '1');
    expect(getAttachedStatusArray(messagesArrayWithOtherMessage)).toEqual([false, undefined, false]);
  });
});
