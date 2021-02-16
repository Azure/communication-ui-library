// © Microsoft Corporation. All rights reserved.
/* eslint-disable no-undef */

import { BaseClientMock, createBaseClientMock } from '../mocks/ChatClientMocks';
import {
  COOL_PERIOD_THRESHOLD,
  CREATED,
  MAXIMUM_RETRY_COUNT,
  OK,
  PRECONDITION_FAILED_RETRY_INTERVAL,
  PRECONDITION_FAILED_STATUS_CODE,
  TOO_MANY_REQUESTS_STATUS_CODE
} from '../constants';
import { act, renderHook } from '@testing-library/react-hooks';

import { SendChatMessageResult } from '@azure/communication-chat';
import { useSendMessage } from './useSendMessage';

export type ThreadClientMock = {
  getMessage: () => void;
  sendMessage: () => void;
} & BaseClientMock;

type SendMessageResponseWithStatus = {
  _response: ResponseWithStatus;
} & SendChatMessageResult;

type ResponseWithStatus = {
  status: number;
};

const UNIT_TEST_THROW_ERROR_FLAG = 99999;
let sendMessageResponseStatus: number;

const mockSendMessageWithCreatedResponse = (): SendMessageResponseWithStatus => {
  return { _response: { status: CREATED }, id: '1' };
};

const mockSendMessageWithTooManyRequestsResponse = (): SendMessageResponseWithStatus => {
  return { _response: { status: TOO_MANY_REQUESTS_STATUS_CODE } };
};

const mockSendMessageWithPreConditionFaileResponse = (): SendMessageResponseWithStatus => {
  return { _response: { status: PRECONDITION_FAILED_STATUS_CODE } };
};

const mockSendMessageWithThrowErrorResponse = (): SendMessageResponseWithStatus => {
  throw new Error('disconnected in unit test');
};

export const createThreadClient = (): ThreadClientMock => {
  const clientMock = createBaseClientMock();
  let sendMessageResponse: () => SendMessageResponseWithStatus;
  switch (sendMessageResponseStatus) {
    case OK:
      sendMessageResponse = mockSendMessageWithCreatedResponse;
      break;
    case TOO_MANY_REQUESTS_STATUS_CODE:
      sendMessageResponse = mockSendMessageWithTooManyRequestsResponse;
      break;
    case PRECONDITION_FAILED_STATUS_CODE:
      sendMessageResponse = mockSendMessageWithPreConditionFaileResponse;
      break;
    case UNIT_TEST_THROW_ERROR_FLAG:
      sendMessageResponse = mockSendMessageWithThrowErrorResponse;
      break;
    default:
      sendMessageResponse = mockSendMessageWithCreatedResponse;
      break;
  }

  const threadClientMock: ThreadClientMock = {
    ...clientMock,
    getMessage: jest.fn(),
    sendMessage: jest.fn(sendMessageResponse)
  };
  return threadClientMock;
};

let threadClientMock: ThreadClientMock;

const mockThreadClient = (): ThreadClientMock => {
  threadClientMock = createThreadClient();
  return threadClientMock;
};

const mockSetFailedMessageIds = jest.fn();

jest.mock('../providers/ChatThreadProvider', () => {
  return {
    useChatThreadClient: jest.fn((): ThreadClientMock => mockThreadClient()),
    useThreadId: jest.fn(() => 'mockThreadId'),
    useSetChatMessages: jest.fn(() => jest.fn()),
    useSetCoolPeriod: jest.fn(() => jest.fn()),
    useSetFailedMessageIds: jest.fn(() => mockSetFailedMessageIds),
    useFailedMessageIds: jest.fn(() => [])
  };
});

jest.mock('./useFetchMessage', () => {
  return {
    useFetchMessage: jest.fn(() => jest.fn())
  };
});

afterEach(() => {
  mockSetFailedMessageIds.mockClear();
});

jest.useFakeTimers();
describe('useSendMessage tests', () => {
  test('should be able to call useSendMessage', async (): Promise<void> => {
    sendMessageResponseStatus = OK;
    const { result } = renderHook(() => useSendMessage());
    await act(async () => {
      await result.current('mockDisplayName', 'mockUserId', 'mockMessage');
    });
    expect(threadClientMock.sendMessage).toBeCalledTimes(1);
    expect(threadClientMock.sendMessage).toBeCalledWith(expect.objectContaining({ content: 'mockMessage' }));
    expect(mockSetFailedMessageIds).toBeCalledTimes(0);
  });
  test('should be able to retry sending message for MAXIMUM_RETRY_COUNT times after encountering PRECONDITION_FAILED_STATUS_CODE status', async (): Promise<
    void
  > => {
    sendMessageResponseStatus = PRECONDITION_FAILED_STATUS_CODE;
    const { result } = renderHook(() => useSendMessage());
    await act(async () => {
      await result.current('mockDisplayName', 'mockUserId', 'mockMessage');
      for (let i = 0; i < 100; i++) {
        jest.advanceTimersByTime(PRECONDITION_FAILED_RETRY_INTERVAL);
        await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run
      }
    });
    expect(threadClientMock.sendMessage).toBeCalledTimes(MAXIMUM_RETRY_COUNT + 1);
    expect(threadClientMock.sendMessage).toBeCalledWith(expect.objectContaining({ content: 'mockMessage' }));
  });
  test('should be able to call retry sending message after COOL_PERIOD_THRESHOLD', async (): Promise<void> => {
    sendMessageResponseStatus = TOO_MANY_REQUESTS_STATUS_CODE;
    const { result } = renderHook(() => useSendMessage());
    const retryTimes = 5;
    await act(async () => {
      await result.current('mockDisplayName', 'mockUserId', 'mockMessage');
      for (let i = 0; i < retryTimes; i++) {
        jest.advanceTimersByTime(COOL_PERIOD_THRESHOLD);
        await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run
      }
    });
    expect(threadClientMock.sendMessage).toBeCalledTimes(retryTimes + 1);
    expect(threadClientMock.sendMessage).toBeCalledWith(expect.objectContaining({ content: 'mockMessage' }));
  });
  test('should add message to failed message if there was network or other error', async (): Promise<void> => {
    sendMessageResponseStatus = UNIT_TEST_THROW_ERROR_FLAG;
    const { result } = renderHook(() => useSendMessage());
    await act(async () => {
      await result.current('mockDisplayName', 'mockUserId', 'mockMessage');
      await Promise.resolve(); // allow any pending jobs in the PromiseJobs queue to run
    });
    expect(threadClientMock.sendMessage).toBeCalledTimes(1);
    expect(mockSetFailedMessageIds).toBeCalledTimes(1);
  });
});
