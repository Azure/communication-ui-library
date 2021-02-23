// © Microsoft Corporation. All rights reserved.
import { Call } from '@azure/communication-calling';
import { renderHook } from '@testing-library/react-hooks';
import { defaultMockCallProps, mockCall, mockCallAgent } from '../mocks';
import { useOutgoingCall } from './useOutgoingCall';

type MockCallContextType = {
  setCallState: () => void;
  call: Call;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type MockCallingContextType = {};

const mockRecevierId = 'b9d25c49-f430-4cd8-91c4-2e79ebfee59f'; // random GUID

// Functions that should be executed on the underlying call / callAgent object
let outgoingCallExecutedCallback: jest.Mock<any, any>;
let hangUpExecutedCallback: jest.Mock<any, any>;
let acceptExecutedCallback: jest.Mock<any, any>;
let rejectExecutedCallback: jest.Mock<any, any>;

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

describe('useOneToOneCall tests', () => {
  beforeEach(() => {
    outgoingCallExecutedCallback = jest.fn();
    hangUpExecutedCallback = jest.fn();
    acceptExecutedCallback = jest.fn();
    rejectExecutedCallback = jest.fn();

    mockCallContext = (): MockCallContextType => {
      return {
        setCallState: () => {
          return;
        },
        call: mockCall({
          ...defaultMockCallProps,
          outgoingCallExecutedCallback,
          hangUpExecutedCallback,
          acceptExecutedCallback,
          rejectExecutedCallback,
          isIncoming: true
        })
      };
    };

    mockCallingContext = (): MockCallingContextType => {
      return {
        callAgent: mockCallAgent({
          ...defaultMockCallProps,
          outgoingCallExecutedCallback,
          hangUpExecutedCallback,
          acceptExecutedCallback,
          rejectExecutedCallback,
          isIncoming: true
        })
      };
    };
  });

  test('using the make call function in the useOutgoingCall hook. Call function in the CallAgent should be called', () => {
    // Arrange
    const { result } = renderHook(() => useOutgoingCall());
    const { makeCall } = result.current;

    // Act
    renderHook(() => makeCall({ communicationUserId: mockRecevierId })).waitForNextUpdate();

    // Assert
    expect(outgoingCallExecutedCallback).toHaveBeenCalledTimes(1);
    expect(hangUpExecutedCallback).not.toHaveBeenCalled();
  });

  test('if use useGroupCall hook, after leaving the call, hangup function in the CallAgent should be called', async () => {
    // Arrange
    const { result } = renderHook(() => useOutgoingCall());
    const { endCall } = result.current;

    // Act
    await endCall();

    // Assert
    expect(hangUpExecutedCallback).toHaveBeenCalledTimes(1);
    expect(outgoingCallExecutedCallback).not.toHaveBeenCalled();
  });
});
