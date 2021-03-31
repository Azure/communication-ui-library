// © Microsoft Corporation. All rights reserved.

import { ChatThread, ChatThreadMember } from '@azure/communication-chat';
import { act, renderHook } from '@testing-library/react-hooks';
import { ChatClientMock, createChatClient } from '../mocks/ChatClientMocks';
import { ThreadClientMock, createThreadClient } from '../mocks/ChatThreadClientMocks';

import { useFetchThreadMembers } from './useFetchThreadMembers';

const mockCurrentUser = 'userId1';

const threadMembersWithCurrentUser = [
  { user: { communicationUserId: mockCurrentUser } },
  { user: { communicationUserId: 'userId2' } },
  { user: { communicationUserId: 'userId3' } }
];

let threadMembersMock: ChatThreadMember[] = [];

let threadMembersToPass: ChatThreadMember[] = [];
const mockSetThreadMembers = (threadMembers: ChatThreadMember[]): void => {
  threadMembersToPass = threadMembers;
};

const mockThreadClient = (): ThreadClientMock => {
  const threadClientMock: ThreadClientMock = createThreadClient();
  threadClientMock.listMembers = () => threadMembersMock;
  return threadClientMock;
};

const mockChatClient = (): ChatClientMock => {
  const chatClientMock: ChatClientMock = createChatClient();
  chatClientMock.getChatThread = async (): Promise<ChatThread> => {
    return { createdBy: { communicationUserId: 'userId' }, members: threadMembersMock };
  };
  return chatClientMock;
};

const mockUseSetGetThreadMembersError: (value: boolean) => void = jest.fn();

jest.mock('../providers/ChatThreadProvider', () => {
  return {
    useChatThreadClient: jest.fn().mockImplementation(
      (): ThreadClientMock => {
        return mockThreadClient();
      }
    ),
    useSetUpdateThreadMembersError: jest.fn(() => jest.fn()),
    useSetThreadMembers: () => mockSetThreadMembers,
    useThreadId: () => 'abcde',
    useSetGetThreadMembersError: jest.fn(() => mockUseSetGetThreadMembersError)
  };
});

jest.mock('../providers/ChatProviderHelper', () => {
  return {
    useChatClient: jest.fn().mockImplementation(
      (): ChatClientMock => {
        return mockChatClient();
      }
    )
  };
});

jest.mock('../providers/ChatProvider', () => {
  return {
    useUserId: () => mockCurrentUser
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
    expect(mockUseSetGetThreadMembersError).toBeCalledTimes(1);
  });
});
