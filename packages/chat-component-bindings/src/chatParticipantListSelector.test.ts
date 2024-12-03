// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { chatParticipantListSelector } from './chatParticipantListSelector';
import { ChatClientState, ChatErrors } from '@internal/chat-stateful-client';
import { ChatParticipant } from '@azure/communication-chat';
import { ChatBaseSelectorProps } from './baseSelectors';

describe('chatParticipantListSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return list of participants if moderator is not found', () => {
    const myUserId = 'user1';
    const myUserDisplayName = 'User 1';
    const mockParticipants: { [key: string]: ChatParticipant } = {
      user1: { id: { communicationUserId: myUserId }, displayName: 'User 1' },
      user2: { id: { communicationUserId: 'user2' }, displayName: 'User 2' }
    };
    const mocks = getMocks(myUserId, myUserDisplayName, mockParticipants);
    const result = chatParticipantListSelector(mocks.state, mocks.props);

    expect(result.myUserId).toBe(myUserId);
    expect(result.participants).toEqual([
      { userId: myUserId, displayName: myUserDisplayName, isRemovable: true },
      { userId: 'user2', displayName: 'User 2', isRemovable: true }
    ]);
  });

  test('should update the moderator display name if they are the local user', () => {
    const myUserId = 'moderator';
    const myUserDisplayName = 'TestUser123';
    const mockParticipants: { [key: string]: ChatParticipant } = {
      user1: { id: { communicationUserId: 'user1' }, displayName: 'User 1' },
      user2: { id: { communicationUserId: 'user2' }, displayName: 'User 2' },
      moderator: { id: { communicationUserId: myUserId }, displayName: undefined }
    };
    const mocks = getMocks(myUserId, myUserDisplayName, mockParticipants);
    const result = chatParticipantListSelector(mocks.state, mocks.props);

    expect(result.myUserId).toBe(myUserId);
    expect(result.participants).toEqual([
      { userId: 'user1', displayName: 'User 1', isRemovable: true },
      { userId: 'user2', displayName: 'User 2', isRemovable: true },
      { userId: myUserId, displayName: myUserDisplayName, isRemovable: true }
    ]);
  });

  test('should remove the moderator from the list if they are not the local user', () => {
    const myUserId = 'user1';
    const myUserDisplayName = 'User 1';
    const mockParticipants: { [key: string]: ChatParticipant } = {
      user1: { id: { communicationUserId: myUserId }, displayName: 'User 1' },
      user2: { id: { communicationUserId: 'user2' }, displayName: 'User 2' },
      moderator: { id: { communicationUserId: 'moderator' }, displayName: undefined }
    };
    const mocks = getMocks(myUserId, myUserDisplayName, mockParticipants);
    const result = chatParticipantListSelector(mocks.state, mocks.props);

    expect(result.myUserId).toBe(myUserId);
    expect(result.participants).toEqual([
      { userId: myUserId, displayName: myUserDisplayName, isRemovable: true },
      { userId: 'user2', displayName: 'User 2', isRemovable: true }
    ]);
  });
});

const getMocks = (
  myUserId: string,
  myUserDisplayName: string,
  participants: {
    [key: string]: ChatParticipant;
  }
): { state: ChatClientState; props: ChatBaseSelectorProps } => {
  const mockState: ChatClientState = {
    userId: { communicationUserId: myUserId, kind: 'communicationUser' },
    displayName: myUserDisplayName,
    threads: {
      thread123: {
        threadId: 'thread123',
        chatMessages: {},
        participants: participants,
        readReceipts: [],
        typingIndicators: [],
        latestReadTime: new Date()
      }
    },
    latestErrors: {} as ChatErrors
  };

  const mockProps: ChatBaseSelectorProps = {
    threadId: 'thread123'
  };

  return { state: mockState, props: mockProps };
};
