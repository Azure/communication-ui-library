// © Microsoft Corporation. All rights reserved.

import { ChatParticipant } from '@azure/communication-chat';
import { act, renderHook } from '@testing-library/react-hooks';
import { ThreadClientMock, createThreadClient } from '../mocks/ChatThreadClientMocks';

import { useFetchThreadMembers } from './useFetchThreadMembers';

const mockCurrentUser = 'userId1';

const threadMembersWithCurrentUser = [
  { user: { communicationUserId: mockCurrentUser } },
  { user: { communicationUserId: 'userId2' } },
  { user: { communicationUserId: 'userId3' } }
];

let threadMembersMock: ChatParticipant[] = [];

let threadMembersToPass: ChatParticipant[] = [];
const mockSetThreadMembers = (threadMembers: ChatParticipant[]): void => {
  threadMembersToPass = threadMembers;
};

const mockThreadClient = (): ThreadClientMock => {
  const threadClientMock: ThreadClientMock = createThreadClient();
  threadClientMock.listParticipants = () => threadMembersMock;
  return threadClientMock;
};
const mockUseSetGetThreadMembersError: (value: boolean) => void = jest.fn();
const mockUseUpdateGetThreadMembersError: (value: boolean) => void = jest.fn();

jest.mock('../providers/ChatThreadProvider', () => {
  return {
    useChatThreadClient: jest.fn().mockImplementation(
      (): ThreadClientMock => {
        return mockThreadClient();
      }
    ),
    useSetUpdateThreadMembersError: jest.fn(() => mockUseUpdateGetThreadMembersError),
    useSetThreadMembers: () => mockSetThreadMembers,
    useThreadId: () => 'abcde',
    useSetGetThreadMembersError: jest.fn(() => mockUseSetGetThreadMembersError)
  };
});

describe('useFetchThreadMembers tests', () => {
  test('should be able to call useFetchThreadMembers', async (): Promise<void> => {
    threadMembersMock = threadMembersWithCurrentUser;
    let fetchThreadMembers: (() => Promise<void>) | undefined = undefined;
    renderHook(() => {
      fetchThreadMembers = useFetchThreadMembers();
    });
    await act(async () => {
      if (fetchThreadMembers !== undefined) await fetchThreadMembers();
    });
    expect(threadMembersToPass).toMatchObject(threadMembersWithCurrentUser);
  });
  test('should mark thread error when fail to fetch members from both listMembers and getThread', async (): Promise<
    void
  > => {
    threadMembersMock = [];
    let fetchThreadMembers: (() => Promise<void>) | undefined = undefined;
    renderHook(() => {
      fetchThreadMembers = useFetchThreadMembers();
    });
    await act(async () => {
      if (fetchThreadMembers !== undefined) await fetchThreadMembers();
    });
    expect(mockUseUpdateGetThreadMembersError).toBeCalledTimes(1);
  });
});
