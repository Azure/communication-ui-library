import { errorBarSelector } from './errorBarSelector';
import { ChatClientState, ChatError, ChatErrors, ChatErrorTarget } from '@internal/chat-stateful-client';
import { ChatBaseSelectorProps } from './baseSelectors';

describe('errorBarSelector', () => {
  test('should return no errors when there are no errors', () => {
    const latestErrors: ChatErrors = {} as ChatErrors;
    const mocks = getMocks(latestErrors);
    const result = errorBarSelector(mocks.state, mocks.props);
    expect(result.activeErrorMessages).toEqual([]);
  });

  test('should return unableToReachChatService error when REQUEST_SEND_ERROR received', () => {
    const latestErrors: ChatErrors = {
      'ChatThreadClient.getProperties': createChatError(
        'REQUEST_SEND_ERROR',
        undefined,
        1,
        'ChatThreadClient.getProperties'
      )
    } as ChatErrors;
    const mocks = getMocks(latestErrors);
    const result = errorBarSelector(mocks.state, mocks.props);
    expect(result.activeErrorMessages).toEqual([{ type: 'unableToReachChatService', timestamp: new Date(1) }]);
  });

  test('should return accessDenied error when 401 status code received', () => {
    const latestErrors: ChatErrors = {
      'ChatThreadClient.getProperties': createChatError('', 401, 1, 'ChatThreadClient.getProperties')
    } as ChatErrors;
    const mocks = getMocks(latestErrors);
    const result = errorBarSelector(mocks.state, mocks.props);
    expect(result.activeErrorMessages).toEqual([{ type: 'accessDenied', timestamp: new Date(1) }]);
  });

  test('should return userNotInChatThread error when 400 status code is received not for send message api', () => {
    userNotInChatThreadTest(400);
  });

  test('should return userNotInChatThread error when 403 status code is received not for send message api', () => {
    userNotInChatThreadTest(403);
  });

  test('should return userNotInChatThread error when 404 status code is received not for send message api', () => {
    userNotInChatThreadTest(404);
  });

  test('should return sendMessageNotInChatThread error when 403 is received for send message api', () => {
    const latestErrors: ChatErrors = {
      'ChatThreadClient.sendMessage': createChatError('', 403, 1, 'ChatThreadClient.sendMessage')
    } as ChatErrors;
    const mocks = getMocks(latestErrors);
    const result = errorBarSelector(mocks.state, mocks.props);
    expect(result.activeErrorMessages).toEqual([{ type: 'sendMessageNotInChatThread', timestamp: new Date(1) }]);
  });

  test('should return sendMessageGeneric error for cases other than 403 errors', () => {
    const latestErrors: ChatErrors = {
      'ChatThreadClient.sendMessage': createChatError('', undefined, 1, 'ChatThreadClient.sendMessage')
    } as ChatErrors;
    const mocks = getMocks(latestErrors);
    const result = errorBarSelector(mocks.state, mocks.props);
    expect(result.activeErrorMessages).toEqual([{ type: 'sendMessageGeneric', timestamp: new Date(1) }]);
  });

  test('should return only the first 3 errors', () => {
    const latestErrors: ChatErrors = {
      'ChatThreadClient.getProperties': createChatError(
        'REQUEST_SEND_ERROR',
        undefined,
        1,
        'ChatThreadClient.getProperties'
      ),
      'ChatThreadClient.listMessages': createChatError('', 401, 2, 'ChatThreadClient.listMessages'),
      'ChatThreadClient.listParticipants': createChatError('', 403, 3, 'ChatThreadClient.listParticipants'),
      'ChatThreadClient.sendMessage': createChatError('', undefined, 4, 'ChatThreadClient.sendMessage')
    } as ChatErrors;
    const mocks = getMocks(latestErrors);
    const result = errorBarSelector(mocks.state, mocks.props);
    expect(result.activeErrorMessages.length).toBe(3);
    expect(result.activeErrorMessages).toEqual([
      { type: 'unableToReachChatService', timestamp: new Date(1) },
      { type: 'accessDenied', timestamp: new Date(2) },
      // it's not userNotInChatThread because sendMessageNotInChatThread has higher priority
      { type: 'sendMessageNotInChatThread', timestamp: new Date(4) }
    ]);
  });

  test('should not return an error if error is received because of the bot contract', () => {
    const botContactMRIPrefix = '28:';
    const message = `Identifier format is not supported (${botContactMRIPrefix}12345)`;
    const latestErrors: ChatErrors = {
      'ChatThreadClient.listMessages': createChatError('', 400, 1, 'ChatThreadClient.listMessages', message)
    } as ChatErrors;
    const mocks = getMocks(latestErrors);
    const result = errorBarSelector(mocks.state, mocks.props);
    expect(result.activeErrorMessages.length).toEqual(0);
  });
});

const getMocks = (errors: ChatErrors): { state: ChatClientState; props: ChatBaseSelectorProps } => {
  const mockState: ChatClientState = {
    userId: { communicationUserId: 'myUserId', kind: 'communicationUser' },
    displayName: 'myUserDisplayName',
    threads: {
      thread123: {
        threadId: 'thread123',
        chatMessages: {},
        participants: {},
        readReceipts: [],
        typingIndicators: [],
        latestReadTime: new Date()
      }
    },
    latestErrors: errors
  };

  const mockProps: ChatBaseSelectorProps = {
    threadId: 'thread123'
  };

  return { state: mockState, props: mockProps };
};

interface CustomError extends Error {
  code: string;
  statusCode?: number;
}

const createChatError = (
  code: string,
  statusCode: number | undefined,
  timestamp: number,
  target: ChatErrorTarget,
  innerErrorMessage = ''
): ChatError => ({
  innerError: { code, statusCode, message: innerErrorMessage } as CustomError,
  timestamp: new Date(timestamp),
  target: target,
  name: 'TestError',
  message: ''
});

const userNotInChatThreadTest = (statusCode: number) => {
  const latestErrors: ChatErrors = {
    'ChatThreadClient.listMessages': createChatError('', statusCode, 1, 'ChatThreadClient.listMessages')
  } as ChatErrors;
  const mocks = getMocks(latestErrors);
  const result = errorBarSelector(mocks.state, mocks.props);
  expect(result.activeErrorMessages).toEqual([{ type: 'userNotInChatThread', timestamp: new Date(1) }]);
};
