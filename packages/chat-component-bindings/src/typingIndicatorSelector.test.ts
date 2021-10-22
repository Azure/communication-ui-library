// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { typingIndicatorSelector } from './typingIndicatorSelector';

// TODO: Make it type safe when update unit tests
const typingIndicatorSelectorResultFunc = (typingIndicatorSelector as any).resultFunc;

describe('typingIndicatorSelector tests', () => {
  test('should filter typing indicators from participant that is the user', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicatorReceivedEvent[] = [
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '1' },
        senderDisplayName: 'User1',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date()
      }
    ];
    const participants = {
      [toFlatCommunicationIdentifier({ communicationUserId: '1' })]: {
        id: { communicationUserId: '1' },
        displayName: 'User1'
      }
    };
    const result = typingIndicatorSelectorResultFunc(
      orderedTypingIndicators,
      participants,
      toFlatCommunicationIdentifier({
        communicationUserId: '1'
      })
    );
    expect(result.typingUsers).toEqual([]);
  });

  test('should filter duplicate typing indicators from the same participant', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicatorReceivedEvent[] = [
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
    const participants = {
      [toFlatCommunicationIdentifier({ communicationUserId: '1' })]: {
        id: { communicationUserId: '1' },
        displayName: 'User1'
      },
      [toFlatCommunicationIdentifier({ communicationUserId: '2' })]: {
        id: { communicationUserId: '2' },
        displayName: 'User2'
      }
    };
    const result = typingIndicatorSelectorResultFunc(
      orderedTypingIndicators,
      participants,
      toFlatCommunicationIdentifier({
        communicationUserId: '1'
      })
    );
    expect(result.typingUsers.length).toEqual(1);
    expect(result.typingUsers).toEqual([
      {
        userId: toFlatCommunicationIdentifier({
          communicationUserId: '2'
        }),
        displayName: 'User2'
      }
    ]);
  });

  test('should list filtered typing indicators from oldest to most recent', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicatorReceivedEvent[] = [
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

    const participants = {
      [toFlatCommunicationIdentifier({ communicationUserId: '2' })]: {
        id: { communicationUserId: '2' },
        displayName: 'User2'
      },
      [toFlatCommunicationIdentifier({ communicationUserId: '3' })]: {
        id: { communicationUserId: '3' },
        displayName: 'User3'
      },
      [toFlatCommunicationIdentifier({ communicationUserId: '4' })]: {
        id: { communicationUserId: '4' },
        displayName: 'User4'
      }
    };
    const result = typingIndicatorSelectorResultFunc(
      orderedTypingIndicators,
      participants,
      toFlatCommunicationIdentifier({
        communicationUserId: '1'
      })
    );
    expect(result.typingUsers.length).toEqual(3);
    expect(result.typingUsers).toEqual([
      { userId: toFlatCommunicationIdentifier({ communicationUserId: '4' }), displayName: 'User4' },
      { userId: toFlatCommunicationIdentifier({ communicationUserId: '2' }), displayName: 'User2' },
      { userId: toFlatCommunicationIdentifier({ communicationUserId: '3' }), displayName: 'User3' }
    ]);
  });

  test('should filter typing indicators older than 8000 milliseconds', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicatorReceivedEvent[] = [
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

    const participants = {
      [toFlatCommunicationIdentifier({ communicationUserId: '5' })]: {
        id: { communicationUserId: '5' },
        displayName: 'User5'
      },
      [toFlatCommunicationIdentifier({ communicationUserId: '6' })]: {
        id: { communicationUserId: '6' },
        displayName: 'User6'
      },
      [toFlatCommunicationIdentifier({ communicationUserId: '7' })]: {
        id: { communicationUserId: '7' },
        displayName: 'User7'
      }
    };
    const result = typingIndicatorSelectorResultFunc(
      orderedTypingIndicators,
      participants,
      toFlatCommunicationIdentifier({
        communicationUserId: '1'
      })
    );
    expect(result.typingUsers.length).toEqual(1);
    expect(result.typingUsers).toEqual([
      { userId: toFlatCommunicationIdentifier({ communicationUserId: '6' }), displayName: 'User6' }
    ]);
  });

  test('should return empty array if there are 20 participants', async (): Promise<void> => {
    const orderedTypingIndicators: TypingIndicatorReceivedEvent[] = [
      {
        threadId: '1',
        version: '1',
        sender: { kind: 'communicationUser', communicationUserId: '5' },
        senderDisplayName: 'User5',
        recipient: { kind: 'communicationUser', communicationUserId: '1' },
        receivedOn: new Date()
      }
    ];
    const participants = {};
    Array.from(Array(20).keys()).forEach(
      (num) => (participants[`${num}`] = { id: `${num}`, displayName: `User${num}` })
    );
    const result = typingIndicatorSelectorResultFunc(
      orderedTypingIndicators,
      participants,
      toFlatCommunicationIdentifier({
        communicationUserId: '1'
      })
    );
    expect(result.typingUsers).toEqual([]);
  });
});
