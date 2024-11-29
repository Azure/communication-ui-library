import { compareMessages } from './compareMessages';
import { Message } from '@internal/react-components';

describe('compareMessages', () => {
  test('should return a negative number if firstMessage is older than secondMessage', () => {
    const firstMessage: Message = {
      createdOn: new Date('2023-01-01T00:00:00Z'),
      messageId: '1',
      messageType: 'chat',
      contentType: 'text'
    };
    const secondMessage: Message = {
      createdOn: new Date('2023-01-02T00:00:00Z'),
      messageId: '2',
      messageType: 'chat',
      contentType: 'html'
    };
    expect(compareMessages(firstMessage, secondMessage)).toBeLessThan(0);
  });

  test('should return a positive number if firstMessage is newer than secondMessage', () => {
    const firstMessage: Message = {
      createdOn: new Date('2023-01-02T00:00:00Z'),
      messageId: '1',
      messageType: 'chat',
      contentType: 'html'
    };
    const secondMessage: Message = {
      createdOn: new Date('2023-01-01T00:00:00Z'),
      messageId: '2',
      messageType: 'chat',
      contentType: 'html'
    };
    expect(compareMessages(firstMessage, secondMessage)).toBeGreaterThan(0);
  });

  test('should return 0 if messages have the same createdOn and messageId', () => {
    const firstMessage: Message = {
      createdOn: new Date('2023-01-01T00:00:00Z'),
      messageId: '1',
      messageType: 'system',
      systemMessageType: 'participantAdded',
      iconName: 'Add',
      participants: [{ userId: '1', displayName: 'User 1' }]
    };
    const secondMessage: Message = {
      createdOn: new Date('2023-01-01T00:00:00Z'),
      messageId: '1',
      messageType: 'chat',
      contentType: 'text'
    };
    expect(compareMessages(firstMessage, secondMessage)).toBe(0);
  });

  test('should return a negative number if messages have the same createdOn but firstMessage has a smaller messageId', () => {
    const firstMessage: Message = {
      createdOn: new Date('2023-01-01T00:00:00Z'),
      messageId: '1',
      messageType: 'chat',
      contentType: 'text'
    };
    const secondMessage: Message = {
      createdOn: new Date('2023-01-01T00:00:00Z'),
      messageId: '2',
      messageType: 'custom',
      content: 'Test'
    };
    expect(compareMessages(firstMessage, secondMessage)).toBeLessThan(0);
  });

  test('should return a positive number if messages have the same createdOn but firstMessage has a larger messageId', () => {
    const firstMessage: Message = {
      createdOn: new Date('2023-01-01T00:00:00Z'),
      messageId: '2',
      messageType: 'custom',
      content: 'Test'
    };
    const secondMessage: Message = {
      createdOn: new Date('2023-01-01T00:00:00Z'),
      messageId: '1',
      messageType: 'chat',
      contentType: 'text'
    };
    expect(compareMessages(firstMessage, secondMessage)).toBeGreaterThan(0);
  });
});
