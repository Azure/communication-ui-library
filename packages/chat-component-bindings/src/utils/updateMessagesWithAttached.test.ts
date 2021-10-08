// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Message } from '@internal/react-components';
import { updateMessagesWithAttached } from './updateMessagesWithAttached';

const createMessageMock = (senderId: string, messageType: 'chat' | 'custom'): Message => {
  return messageType === 'chat'
    ? {
        messageType,
        senderId,
        contentType: 'text',
        createdOn: new Date(),
        messageId: ''
      }
    : {
        messageType,
        content: '',
        createdOn: new Date(),
        messageId: ''
      };
};

const getAttachedStatusArray = (messages: Message[]) => {
  return messages.map((message) => (message.messageType === 'chat' ? message.attached : undefined));
};

describe('update message with attached status', () => {
  test('Set right status for attached property for 1 message', () => {
    const oneMessageArray: Message[] = [createMessageMock('1', 'chat')];

    updateMessagesWithAttached(oneMessageArray, '1');
    expect(getAttachedStatusArray(oneMessageArray)).toEqual([false]);
  });

  test('Set right status for attached property for 3 messages', () => {
    const threeMessagesArray = [
      createMessageMock('1', 'chat'),
      createMessageMock('1', 'chat'),
      createMessageMock('2', 'chat')
    ];

    updateMessagesWithAttached(threeMessagesArray, '1');
    expect(getAttachedStatusArray(threeMessagesArray)).toEqual(['top', 'bottom', false]);
  });

  test('Set right status for attached property for messages from different users', () => {
    const fiveMessagesArray = [
      createMessageMock('2', 'chat'),
      createMessageMock('1', 'chat'),
      createMessageMock('1', 'chat'),
      createMessageMock('1', 'chat'),
      createMessageMock('2', 'chat')
    ];

    updateMessagesWithAttached(fiveMessagesArray, '1');
    expect(getAttachedStatusArray(fiveMessagesArray)).toEqual([false, 'top', true, 'bottom', false]);
  });

  test('Set right status for attached property for different types of messages', () => {
    const messagesArrayWithOtherMessage = [
      createMessageMock('1', 'chat'),
      createMessageMock('2', 'custom'),
      createMessageMock('1', 'chat')
    ];

    updateMessagesWithAttached(messagesArrayWithOtherMessage, '1');
    expect(getAttachedStatusArray(messagesArrayWithOtherMessage)).toEqual([false, undefined, false]);
  });
});
