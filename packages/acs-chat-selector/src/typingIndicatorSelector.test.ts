// © Microsoft Corporation. All rights reserved.

import { TypingIndicator, communicationIdentifierAsKey } from '@azure/acs-chat-declarative';
import { typingIndicatorSelector } from './typingIndicatorSelector';

describe('typingIndicatorSelector tests', () => {
  test('should filter typing indicators from participant that is the user', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '1' },
        senderDisplayName: 'User1',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date()
      }
    ];
    const participants = new Map();
    participants.set('1', { id: '1', displayName: 'User1' });
    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, {
      kind: 'communicationUser',
      communicationUserId: '1'
    });
    expect(result.typingUsers).toEqual([]);
  });

  test('should filter duplicate typing indicators from the same participant', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '2' },
        senderDisplayName: 'User2',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 1000)
      },
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '2' },
        senderDisplayName: 'User2',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date()
      }
    ];

    const participants = new Map();
    participants.set(communicationIdentifierAsKey({ communicationUserId: '1' }), {
      id: { communicationUserId: '1' },
      displayName: 'User1'
    });
    participants.set(communicationIdentifierAsKey({ communicationUserId: '2' }), {
      id: { communicationUserId: '2' },
      displayName: 'User2'
    });
    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, {
      kind: 'communicationUser',
      communicationUserId: '1'
    });
    expect(result.typingUsers.length).toEqual(1);
    expect(result.typingUsers).toEqual([
      { userId: { kind: 'communicationUser', communicationUserId: '2' }, displayName: 'User2' }
    ]);
  });

  test('should list filtered typing indicators from oldest to most recent', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '3' },
        senderDisplayName: 'User3',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 2000)
      },
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '2' },
        senderDisplayName: 'User2',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 1500)
      },
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '4' },
        senderDisplayName: 'User4',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 1000)
      }
    ];
    const participants = new Map();
    participants.set(communicationIdentifierAsKey({ communicationUserId: '2' }), {
      id: { communicationUserId: '2' },
      displayName: 'User2'
    });
    participants.set(communicationIdentifierAsKey({ communicationUserId: '3' }), {
      id: { communicationUserId: '1' },
      displayName: 'User3'
    });
    participants.set(communicationIdentifierAsKey({ communicationUserId: '4' }), {
      id: { communicationUserId: '2' },
      displayName: 'User4'
    });

    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, {
      kind: 'communicationUser',
      communicationUserId: '1'
    });
    expect(result.typingUsers.length).toEqual(3);
    expect(result.typingUsers).toEqual([
      { userId: { kind: 'communicationUser', communicationUserId: '4' }, displayName: 'User4' },
      { userId: { kind: 'communicationUser', communicationUserId: '2' }, displayName: 'User2' },
      { userId: { kind: 'communicationUser', communicationUserId: '3' }, displayName: 'User3' }
    ]);
  });

  test('should filter typing indicators older than 8000 milliseconds', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '7' },
        senderDisplayName: 'User7',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 10500)
      },
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '5' },
        senderDisplayName: 'User5',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 9000)
      },
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '6' },
        senderDisplayName: 'User6',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date(Date.now() - 3000)
      }
    ];
    const participants = new Map();
    participants.set('5', { id: '5', displayName: 'User5' });
    participants.set('6', { id: '6', displayName: 'User6' });
    participants.set('7', { id: '7', displayName: 'User7' });
    participants.set(communicationIdentifierAsKey({ communicationUserId: '5' }), {
      id: { communicationUserId: '5' },
      displayName: 'User5'
    });
    participants.set(communicationIdentifierAsKey({ communicationUserId: '6' }), {
      id: { communicationUserId: '6' },
      displayName: 'User6'
    });
    participants.set(communicationIdentifierAsKey({ communicationUserId: '7' }), {
      id: { communicationUserId: '7' },
      displayName: 'User7'
    });

    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, {
      kind: 'communicationUser',
      communicationUserId: '1'
    });
    expect(result.typingUsers.length).toEqual(1);
    expect(result.typingUsers).toEqual([
      { userId: { kind: 'communicationUser', communicationUserId: '6' }, displayName: 'User6' }
    ]);
  });

  test('should return empty array if there are 20 participants', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicator[] = [
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '5' },
        senderDisplayName: 'User5',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date()
      }
    ];
    const participants = new Map();
    Array.from(Array(20).keys()).forEach((num) =>
      participants.set(`${num}`, { id: `${num}`, displayName: `User${num}` })
    );
    const result = typingIndicatorSelector.resultFunc(orderedTypingIndicators, participants, {
      kind: 'communicationUser',
      communicationUserId: '1'
    });
    expect(result.typingUsers).toEqual([]);
  });
});
