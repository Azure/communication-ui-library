// © Microsoft Corporation. All rights reserved.

import { OK, TEXT_MESSAGE } from '../constants';
import { ThreadClientMock, createThreadClient } from '../mocks/ChatThreadClientMocks';
import { act, renderHook } from '@testing-library/react-hooks';

import { ChatMessage } from '@azure/communication-chat';
import { useFetchMessage } from './useFetchMessage';

let threadClientMock: ThreadClientMock;

type ResponseWithStatus = {
  status: number;
};

type ChatMessageWithResponseStatus = {
  _response: ResponseWithStatus;
} & ChatMessage;

export const mockChatMessageWithResponse = (): ChatMessageWithResponseStatus => {
  return {
    _response: { status: OK },
    id: '1',
    content: { message: '1' },
    type: TEXT_MESSAGE,
    sequenceId: '',
    createdOn: new Date(),
    version: ''
  };
};

export const mockChatMessage = (): ChatMessage => {
  return {
    id: '1',
    content: { message: '1' },
    type: TEXT_MESSAGE,
    sequenceId: '',
    createdOn: new Date(0),
    version: ''
  };
};

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
    )
  };
});

describe('useFetchMessage tests', () => {
  test('should be able to call useFetchMessage to get the correct messages', async (): Promise<void> => {
    const expectedMessage: ChatMessage = mockChatMessage();
    const { result } = renderHook(() => useFetchMessage());
    let message: ChatMessage | undefined;
    await act(async () => {
      message = await result.current('1');
    });
    expect(threadClientMock.getMessage).toBeCalledTimes(1);
    expect(message).toMatchObject(expectedMessage);
  });
});
