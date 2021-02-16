// © Microsoft Corporation. All rights reserved.
import { Call } from '@azure/communication-calling';
import { renderHook } from '@testing-library/react-hooks';
import { defaultMockCallProps, mockCall, mockCallAgent } from '../mocks';
import { useGroupCall } from './useGroupCall';

type MockCallContextType = {
  call: Call;
};
type MockCallingContextType = {};

const mockGroupId = 'b9d25c49-f430-4cd8-91c4-2e79ebfee59f'; // random GUID

const mockLeaveOptions = {
  forEveryone: false
};

let isJoinExecuted: jest.Mock<any, any>;
let isHangUpExecuted: jest.Mock<any, any>;

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

describe('useGroupCall tests', () => {
  beforeEach(() => {
    isJoinExecuted = jest.fn();
    isHangUpExecuted = jest.fn();

    mockCallContext = (): MockCallContextType => {
      return {
        call: mockCall({ ...defaultMockCallProps, isJoinExecuted, isHangUpExecuted })
      };
    };

    mockCallingContext = (): MockCallingContextType => {
      return {
        callAgent: mockCallAgent({
          ...defaultMockCallProps,
          isJoinExecuted: isJoinExecuted,
          isHangUpExecuted: isHangUpExecuted
        })
      };
    };
  });

  test('using the join function in the useGroupCall hook. Hangup function in the CallAgent should not be called', () => {
    // Arrange
    const { result } = renderHook(() => useGroupCall());
    const { join } = result.current;

    // Act
    renderHook(() => join({ groupId: mockGroupId })).waitForNextUpdate();

    // Assert
    expect(isJoinExecuted).toHaveBeenCalledTimes(1);
    expect(isHangUpExecuted).not.toHaveBeenCalled();
  });

  test('if use useGroupCall hook, after leaving the call, hangup function in the CallAgent should be called', async () => {
    // Arrange
    const { result } = renderHook(() => useGroupCall());
    const { leave } = result.current;

    // Act
    await leave(mockLeaveOptions);

    // Assert
    expect(isHangUpExecuted).toHaveBeenCalledTimes(1);
  });

  test('if join in the callAgent throws an error, join from the useGroupCall hook is expected to throw an error', async () => {
    const mockErrorMessage = 'join failed';

    // mock the join function in the sdk throwing an error
    isJoinExecuted.mockImplementation(() => {
      throw new Error(mockErrorMessage);
    });

    // Arrange
    const { result } = renderHook(() => useGroupCall());
    const { join } = result.current;

    // Act
    renderHook(() => join({ groupId: mockGroupId })).waitForNextUpdate();

    // Assert
    expect(isJoinExecuted).toThrowError(mockErrorMessage);
  });

  test('if hangup in the call throws an error, leave from the useGroupCall hook is expected to throw an error', async () => {
    // mock the hangup function in the sdk throwing an error
    isHangUpExecuted.mockImplementation(() => {
      throw new Error('hangUp failed');
    });

    const { result } = renderHook(() => useGroupCall());

    await expect(result.current.leave(mockLeaveOptions)).rejects.toThrowError();
  });
});
