// © Microsoft Corporation. All rights reserved.

import { renderHook } from '@testing-library/react-hooks';
import { ThreadClientMock, createThreadClient } from '../mocks/ChatThreadClientMocks';
import { useSendTypingNotification } from './useSendTypingNotification';

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

describe('useSendTypingNotification test', () => {
  test('should be able to call sendTypingNotification inside useSendTypingNotification', async (): Promise<void> => {
    let sendTypingNotification: (() => Promise<boolean>) | undefined = undefined;
    renderHook(() => {
      sendTypingNotification = useSendTypingNotification();
      sendTypingNotification();
    });
    expect(threadClientMock.sendTypingNotification).toBeCalledTimes(1);
  });
});
