// © Microsoft Corporation. All rights reserved.

import { renderHook } from '@testing-library/react-hooks';
import { ThreadClientMock, createThreadClient } from '../mocks/ChatThreadClientMocks';

import { useSendReadReceipt } from './useSendReadReceipt';

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
    )
  };
});

describe('useSendReadReceipt test', () => {
  test('should be able to call sendReadReceipt inside useSendReadReceipt', async (): Promise<void> => {
    renderHook(() => {
      const sendReadReceipt = useSendReadReceipt();
      if (sendReadReceipt !== undefined) sendReadReceipt('mock message id');
    });
    expect(threadClientMock.sendReadReceipt).toBeCalledTimes(1);
  });
});
