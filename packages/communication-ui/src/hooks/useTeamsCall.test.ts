// © Microsoft Corporation. All rights reserved.
import { Call } from '@azure/communication-calling';
import { renderHook } from '@testing-library/react-hooks';
import { defaultMockCallProps, mockCall, mockCallAgent } from '../mocks';
import { useTeamsCall } from './useTeamsCall';

type MockCallContextType = {
  call: Call;
};
type MockCallingContextType = {};

const mockTeamsLink =
  'https://teams.microsoft.com/l/meetup-join/19%3ameeting_YzM4NTRiMWYtNjg1ZC00NmQ1LWFjMDUtNGFlNTU5ZGI5NDA3%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%22dbbb7384-5f72-4d14-a2c0-748dc303084d%22%7d​​​​​​​';

const mockLeaveOptions = {
  forEveryone: false
};

let joinExecutedCallback: jest.Mock<any, any>;
let hangUpExecutedCallback: jest.Mock<any, any>;

let mockCallContext: () => MockCallContextType;
let mockCallingContext: () => MockCallingContextType;

jest.mock('../providers', () => {
  return {
    useCallingContext: jest.fn().mockImplementation(
      (): MockCallingContextType => {
        return mockCallingContext();
      }
    ),
    useCallContext: jest.fn().mockImplementation(
      (): MockCallContextType => {
        return mockCallContext();
      }
    )
  };
});

describe('useTeamsCall tests', () => {
  beforeEach(() => {
    joinExecutedCallback = jest.fn();
    hangUpExecutedCallback = jest.fn();

    mockCallContext = (): MockCallContextType => {
      return {
        call: mockCall({ ...defaultMockCallProps, joinExecutedCallback, hangUpExecutedCallback })
      };
    };

    mockCallingContext = (): MockCallingContextType => {
      return {
        callAgent: mockCallAgent({
          ...defaultMockCallProps,
          joinExecutedCallback: joinExecutedCallback,
          hangUpExecutedCallback: hangUpExecutedCallback
        })
      };
    };
  });

  test('If you use useTeamsCall, you should not be joining a call unless explicitly executed', () => {
    // Act
    renderHook(() => useTeamsCall());

    // Assert
    expect(joinExecutedCallback).not.toHaveBeenCalled();
    expect(hangUpExecutedCallback).not.toHaveBeenCalled();
  });

  test('if use useTeamsCall hook, after leaving the call, hangup function in the CallAgent should be called', async () => {
    // Arrange
    const { result } = renderHook(() => useTeamsCall());
    const { join, leave } = result.current;

    join(mockTeamsLink);

    // Act
    await leave(mockLeaveOptions);

    // Assert
    expect(hangUpExecutedCallback).toHaveBeenCalledTimes(1);
  });

  test('if hangup in the call throws an error, leave from the useTeamsCall hook is expected to throw an error', async () => {
    // mock the hangup function in the sdk throwing an error
    hangUpExecutedCallback.mockImplementation(() => {
      throw new Error('hangUp failed');
    });

    const { result } = renderHook(() => useTeamsCall());

    await expect(result.current.leave(mockLeaveOptions)).rejects.toThrowError();
  });
});
