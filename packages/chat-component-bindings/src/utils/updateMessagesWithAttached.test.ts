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

const oneMessageArray: Message[] = [createMessageMock('1', 'chat')];

const threeMessagesArray = [
  createMessageMock('1', 'chat'),
  createMessageMock('1', 'chat'),
  createMessageMock('2', 'chat')
];

const fiveMessagesArray = [
  createMessageMock('2', 'chat'),
  createMessageMock('1', 'chat'),
  createMessageMock('1', 'chat'),
  createMessageMock('1', 'chat'),
  createMessageMock('2', 'chat')
];

const messagesArrayWithOtherMessage = [
  createMessageMock('1', 'chat'),
  createMessageMock('2', 'custom'),
  createMessageMock('1', 'chat')
];

const getAttachedStatusArray = (messages: Message[]) => {
  return messages.map((message) => (message.messageType === 'chat' ? message.attached : undefined));
};

describe('update message with attached status', () => {
  test('Set right status for attached property for 1 message', () => {
    updateMessagesWithAttached(oneMessageArray, '1');
    expect(getAttachedStatusArray(oneMessageArray)).toEqual([false]);
  });

  test('Set right status for attached property for 3 messages', () => {
    updateMessagesWithAttached(threeMessagesArray, '1');
    expect(getAttachedStatusArray(threeMessagesArray)).toEqual(['top', 'bottom', false]);
  });

  test('Set right status for attached property for messages from different users', () => {
    updateMessagesWithAttached(fiveMessagesArray, '1');
    expect(getAttachedStatusArray(fiveMessagesArray)).toEqual([false, 'top', true, 'bottom', false]);
  });

  test('Set right status for attached property for different types of messages', () => {
    updateMessagesWithAttached(messagesArrayWithOtherMessage, '1');
    expect(getAttachedStatusArray(messagesArrayWithOtherMessage)).toEqual([false, undefined, false]);
  });
});
