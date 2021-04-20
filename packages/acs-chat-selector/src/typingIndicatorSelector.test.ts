// © Microsoft Corporation. All rights reserved.

import { TypingIndicator } from '@azure/acs-chat-declarative';
import { typingIndicatorSelector } from './typingIndicatorSelector';

describe('typingIndicatorSelector tests', () => {
  test('should filter typing indicators from participant that is the user', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '1' }, displayName: 'User1' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date()
      }
    ];
    const participants = new Map();
    participants.set('1', { id: '1', displayName: 'User1' });
    const userId = '1';
    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, userId);
    expect(result.typingUsers).toEqual([]);
  });

  test('should filter duplicate typing indicators from the same participant', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '2' }, displayName: 'User2' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 1000)
      },
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '2' }, displayName: 'User2' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date()
      }
    ];
    const participants = new Map();
    participants.set('1', { id: '1', displayName: 'User1' });
    const userId = '1';
    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, userId);
    expect(result.typingUsers.length).toEqual(1);
    expect(result.typingUsers).toEqual([{ userId: '2', displayName: 'User2' }]);
  });

  test('should list filtered typing indicators from oldest to most recent', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '3' }, displayName: 'User3' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 2000)
      },
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '2' }, displayName: 'User2' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 1500)
      },
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '4' }, displayName: 'User4' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 1000)
      }
    ];
    const participants = new Map();
    participants.set('2', { id: '2', displayName: 'User2' });
    participants.set('3', { id: '3', displayName: 'User3' });
    participants.set('4', { id: '4', displayName: 'User4' });
    const userId = '1';
    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, userId);
    expect(result.typingUsers.length).toEqual(3);
    expect(result.typingUsers).toEqual([
      { userId: '4', displayName: 'User4' },
      { userId: '2', displayName: 'User2' },
      { userId: '3', displayName: 'User3' }
    ]);
  });

  test('should filter typing indicators older than 8000 milliseconds', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '7' }, displayName: 'User7' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 10500)
      },
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '5' }, displayName: 'User5' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 9000)
      },
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '6' }, displayName: 'User6' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 3000)
      }
    ];
    const participants = new Map();
    participants.set('5', { id: '5', displayName: 'User5' });
    participants.set('6', { id: '6', displayName: 'User6' });
    participants.set('7', { id: '7', displayName: 'User7' });
    const userId = '1';
    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, userId);
    expect(result.typingUsers.length).toEqual(1);
    expect(result.typingUsers).toEqual([{ userId: '6', displayName: 'User6' }]);
  });

  test('should return empty array if there are 20 participants', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { user: { communicationUserId: '5' }, displayName: 'User5' },
        recipient: { communicationUserId: '1' },
        receivedOn: new Date()
      }
    ];
    const participants = new Map();
    Array.from(Array(20).keys()).forEach((num) =>
      participants.set(`${num}`, { id: `${num}`, displayName: `User${num}` })
    );
    const userId = '1';
    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, userId);
    expect(result.typingUsers).toEqual([]);
  });
});
