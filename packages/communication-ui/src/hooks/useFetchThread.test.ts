// © Microsoft Corporation. All rights reserved.

import { ChatThread } from '@azure/communication-chat';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { ChatClientMock, createChatClient } from '../mocks/ChatClientMocks';

import { useFetchThread } from './useFetchThread';

const mockChatClient = (): ChatClientMock => {
  return createChatClient();
};

jest.mock('../providers/ChatProvider', () => {
  return {
    useChatClient: jest.fn().mockImplementation(
      (): ChatClientMock => {
        return mockChatClient();
      }
    )
  };
});

let threadToPass: ChatThread | undefined = undefined;
const mockSetThread = (thread: ChatThread): void => {
  threadToPass = thread;
};
const expectThread = { createdBy: { communicationUserId: 'userId' } };

jest.mock('../providers/ChatThreadProvider', () => {
  return {
    useThreadId: jest.fn(() => jest.fn()),
    useSetThread: () => mockSetThread
  };
});

describe('useFetchThread tests', () => {
  test('should be able to call useFetchThread', async (): Promise<void> => {
    let fetchThread: (() => Promise<void>) | undefined = undefined;
    renderHook(() => {
      fetchThread = useFetchThread();
    });
    await act(async () => {
      if (fetchThread !== undefined) await fetchThread();
    });
    expect(threadToPass).toMatchObject(expectThread);
  });
});
