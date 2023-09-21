// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessage, CustomMessage, Message, MessageAttachedStatus } from '@internal/react-components';
import { MINUTE_IN_MS } from './constants';
import { updateMessagesWithAttached } from './updateMessagesWithAttached';

const cannedChatMessage = (senderId: string): ChatMessage => ({
  messageType: 'chat',
  senderId,
  contentType: 'text',
  createdOn: new Date(),
  messageId: ''
});

const cannedCustomDateTimeChatMessage = (senderId: string, createdOnDateTime?: Date): ChatMessage => ({
  messageType: 'chat',
  senderId,
  contentType: 'text',
  createdOn: createdOnDateTime ?? new Date(''),
  messageId: ''
});

const cannedCustomMessage = (): CustomMessage => ({
  messageType: 'custom',
  content: '',
  createdOn: new Date(),
  messageId: ''
});

const getAttachedStatusArray = (messages: Message[]): (MessageAttachedStatus | undefined)[] => {
  return messages.map((message) => (message.messageType === 'chat' ? message.attached : undefined));
};

describe('update message with attached status', () => {
  test('Set right status for attached property for 1 message', () => {
    const oneMessageArray: Message[] = [cannedChatMessage('1')];

    updateMessagesWithAttached(oneMessageArray);
    expect(getAttachedStatusArray(oneMessageArray)).toEqual([false]);
  });

  test('Set right status for attached property for 3 messages', () => {
    const threeMessagesArray = [cannedChatMessage('1'), cannedChatMessage('1'), cannedChatMessage('2')];

    updateMessagesWithAttached(threeMessagesArray);
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

    updateMessagesWithAttached(fiveMessagesArray);
    expect(getAttachedStatusArray(fiveMessagesArray)).toEqual([false, 'top', true, 'bottom', false]);
  });

  test('Set right status for attached property for different types of messages', () => {
    const messagesArrayWithOtherMessage = [cannedChatMessage('1'), cannedCustomMessage(), cannedChatMessage('1')];

    updateMessagesWithAttached(messagesArrayWithOtherMessage);
    expect(getAttachedStatusArray(messagesArrayWithOtherMessage)).toEqual([false, undefined, false]);
  });

  test('Set right status for attached property for messages with more than or equal to 5 mins time gap', () => {
    const currentDateTime = new Date();
    const messagesArrayWithOtherMessage = [
      cannedCustomDateTimeChatMessage('1', currentDateTime),
      cannedCustomDateTimeChatMessage('1', new Date(currentDateTime.getTime() + 5 * MINUTE_IN_MS)),
      cannedCustomDateTimeChatMessage('1', new Date(currentDateTime.getTime() + 10 * MINUTE_IN_MS))
    ];
    updateMessagesWithAttached(messagesArrayWithOtherMessage);
    expect(getAttachedStatusArray(messagesArrayWithOtherMessage)).toEqual(['top', false, false]);
  });

  test('Set right status for attached property for messages with less than 5 mins time gap', () => {
    const currentDateTime = new Date();

    const messagesArrayWithOtherMessage = [
      cannedCustomDateTimeChatMessage('1', currentDateTime),
      cannedCustomDateTimeChatMessage('1', new Date(currentDateTime.getTime() + 2 * MINUTE_IN_MS)),
      cannedCustomDateTimeChatMessage('1', new Date(currentDateTime.getTime() + 4 * MINUTE_IN_MS))
    ];
    updateMessagesWithAttached(messagesArrayWithOtherMessage);
    expect(getAttachedStatusArray(messagesArrayWithOtherMessage)).toEqual(['top', true, 'bottom']);
  });

  test('Set right status for attached property for messages without createOn date', () => {
    const messagesArrayWithOtherMessage = [
      cannedCustomDateTimeChatMessage('1'),
      cannedCustomDateTimeChatMessage('1'),
      cannedCustomDateTimeChatMessage('1')
    ];
    updateMessagesWithAttached(messagesArrayWithOtherMessage);
    expect(getAttachedStatusArray(messagesArrayWithOtherMessage)).toEqual(['top', true, 'bottom']);
  });
});
