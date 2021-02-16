// © Microsoft Corporation. All rights reserved.

import { ThreadClientMock, createThreadClient, mockChatMessages } from '../mocks/ChatThreadClientMocks';

import { ChatMessage } from '@azure/communication-chat';
import { PAGE_SIZE } from '../constants';
import { useFetchMessages } from './useFetchMessages';
import { act, renderHook } from '@testing-library/react-hooks';

let threadClientMock: ThreadClientMock;

const mockThreadClient = (): ThreadClientMock => {
  threadClientMock = createThreadClient();
  return threadClientMock;
};

jest.mock('../providers/ChatThreadProvider', () => {
  return {
    useChatThreadClient: jest.fn().mockImplementation(
      (): ThreadClientMock => {
        return mockThreadClient();
      }
    ),
    useSetChatMessages: jest.fn(() => jest.fn())
  };
});

describe('useFetchMessages tests', () => {
  test('should be able to call useFetchMessages', async (): Promise<void> => {
    renderHook(() => {
      const fetchMessages = useFetchMessages();
      if (fetchMessages !== undefined) fetchMessages({ maxPageSize: PAGE_SIZE });
    });

    expect(threadClientMock.listMessages).toBeCalledTimes(1);
  });
  test('should be able to call useFetchMessages to get the correct messages', async (): Promise<void> => {
    const expectedMessages: ChatMessage[] = mockChatMessages().reverse();
    let messages: ChatMessage[] = [];
    const {
      result: { current: fetchMessages }
    } = renderHook(() => useFetchMessages());

    await act(async () => {
      messages = await fetchMessages({ maxPageSize: PAGE_SIZE });
    });

    expect(messages).toMatchObject(expectedMessages);
  });
});
