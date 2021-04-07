// © Microsoft Corporation. All rights reserved.
/* eslint-disable no-undef */

import { BaseClientMock, createBaseClientMock } from '../mocks/ChatClientMocks';
import {
  CREATED,
  MAXIMUM_RETRY_COUNT,
  OK,
  PRECONDITION_FAILED_STATUS_CODE,
  TOO_MANY_REQUESTS_STATUS_CODE
} from '../constants';
import { renderHook } from '@testing-library/react-hooks';

import { SendChatMessageResult } from '@azure/communication-chat';
import { useSendMessage } from './useSendMessage';
import { CommunicationUiError } from '../types/CommunicationUiError';

/**
 * Unfortunately could not just mock single exported variable in chatConstants in Jest so we have to mock every since
 * constant used by useSendMessage. If you find this test breaking and you made a change to chatConstants see if this
 * mock has values that needs to be updated. If you find this test breaking and you made a change to useSendMessage see
 * if this mock needs to be updated with any new constants.
 */
jest.mock('../constants/chatConstants', () => {
  return {
    COOL_PERIOD_THRESHOLD: 1,
    PRECONDITION_FAILED_RETRY_INTERVAL: 1,
    CREATED: 201,
    MAXIMUM_INT64: 9223372036854775807,
    MAXIMUM_RETRY_COUNT: 3,
    PRECONDITION_FAILED_STATUS_CODE: 412,
    TOO_MANY_REQUESTS_STATUS_CODE: 429
  };
});

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

/**
 * Note current behavior of TOO_MANY_REQUESTS is to resend the message after a cool down period. This means in a test
 * scenario where we alreays return TOO_MANY_REQUESTS this leads to infinite loop. So this counter is added to break
 * the infinite loop by stop returning TOO_MANY_REQUESTS. Maybe we should look into having a MAX_RETRY similar to
 * PRECONDITION_FAILED scenario.
 */
let tooManyRequestsCounter = 0;
const mockSendMessageWithTooManyRequestsResponse = (): SendMessageResponseWithStatus => {
  if (tooManyRequestsCounter < 1) {
    tooManyRequestsCounter++;
    return { _response: { status: TOO_MANY_REQUESTS_STATUS_CODE }, id: '' };
  } else {
    return { _response: { status: CREATED }, id: '1' };
  }
};

const mockSendMessageWithPreConditionFaileResponse = (): SendMessageResponseWithStatus => {
  return { _response: { status: PRECONDITION_FAILED_STATUS_CODE }, id: '' };
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

describe('useSendMessage tests', () => {
  test('should be able to call useSendMessage', async () => {
    sendMessageResponseStatus = OK;
    const { result } = renderHook(() => useSendMessage('mockDisplayName', 'mockUserId'));
    await result.current('mockMessage');
    expect(threadClientMock.sendMessage).toBeCalledTimes(1);
    expect(threadClientMock.sendMessage).toBeCalledWith(expect.objectContaining({ content: 'mockMessage' }));
    expect(mockSetFailedMessageIds).toBeCalledTimes(0);
  });
  test('should be able to retry sending message for MAXIMUM_RETRY_COUNT times after encountering PRECONDITION_FAILED_STATUS_CODE status and after max retry throw an error', async () => {
    sendMessageResponseStatus = PRECONDITION_FAILED_STATUS_CODE;
    const { result } = renderHook(() => useSendMessage('mockDisplayName', 'mockUserId'));
    let caughtError;
    try {
      await result.current('mockMessage');
    } catch (error) {
      caughtError = error;
    }
    expect(threadClientMock.sendMessage).toBeCalledTimes(MAXIMUM_RETRY_COUNT + 1);
    expect(threadClientMock.sendMessage).toBeCalledWith(expect.objectContaining({ content: 'mockMessage' }));
    expect(caughtError).toBeDefined();
    expect(caughtError instanceof CommunicationUiError).toBe(true);
  });
  test('should be able to call retry sending message after COOL_PERIOD_THRESHOLD', async () => {
    sendMessageResponseStatus = TOO_MANY_REQUESTS_STATUS_CODE;
    tooManyRequestsCounter = 0;
    const { result } = renderHook(() => useSendMessage('mockDisplayName', 'mockUserId'));
    await result.current('mockMessage');
    expect(threadClientMock.sendMessage).toBeCalledTimes(tooManyRequestsCounter + 1);
    expect(threadClientMock.sendMessage).toBeCalledWith(expect.objectContaining({ content: 'mockMessage' }));
  });
  test('should throw an error and update failedIds if chat client send message threw an error', async () => {
    sendMessageResponseStatus = UNIT_TEST_THROW_ERROR_FLAG;
    const { result } = renderHook(() => useSendMessage('mockDisplayName', 'mockUserId'));
    let caughtError;
    try {
      await result.current('mockDisplayName', 'mockUserId', 'mockMessage');
    } catch (error) {
      caughtError = error;
    }
    expect(threadClientMock.sendMessage).toBeCalledTimes(1);
    expect(mockSetFailedMessageIds).toBeCalledTimes(1);
    expect(caughtError).toBeDefined();
    expect(caughtError instanceof CommunicationUiError).toBe(true);
  });
});
