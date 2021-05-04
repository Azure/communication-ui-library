// © Microsoft Corporation. All rights reserved.
import { renderHook } from '@testing-library/react-hooks';
import { useMicrophone } from './useMicrophone';
import { CallAgent } from '@azure/communication-calling';
import { defaultMockCallProps, mockCallAgent } from '../mocks';
import { CommunicationUiError } from '../types/CommunicationUiError';
import { DevicePermissionState } from '../types/DevicePermission';

type MockCallingContextType = {
  callAgent: CallAgent;
  audioDevicePermission: DevicePermissionState;
};

type MockCallContextType = {
  isMicrophoneEnabled: boolean;
  setIsMicrophoneEnabled: jest.Mock<any, any>;
};

let muteExecuted = jest.fn();
let unmuteExecuted = jest.fn();
let setIsMicrophoneEnabledMock = jest.fn();
let microphoneMutedInitialState = false;
let microphonePermissionInitialState: DevicePermissionState = 'Granted';

let mockCallingContext: () => MockCallingContextType;
let mockCallContext: () => MockCallContextType;

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

jest.mock('../providers/ErrorProvider', () => {
  return {
    useTriggerOnErrorCallback: jest.fn()
  };
});

describe('useMicrophone tests', () => {
  const consoleErrorMockInitialValue = console.error;

  beforeEach(() => {
    muteExecuted = jest.fn();
    unmuteExecuted = jest.fn();
    setIsMicrophoneEnabledMock = jest.fn();
    microphoneMutedInitialState = false;
    microphonePermissionInitialState = 'Granted';
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: mockCallAgent({
          ...defaultMockCallProps,
          muteExecutedCallback: muteExecuted,
          unmuteExecutedCallback: unmuteExecuted,
          isMicrophoneMuted: microphoneMutedInitialState
        }) as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
  });

  afterEach(() => {
    // reset any console error mocking
    console.error = consoleErrorMockInitialValue;
  });

  test('if microphone is muted, unmute mic should unmute the microphone', async () => {
    // Arrange
    microphoneMutedInitialState = true;
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.unmute();

    // Assert
    expect(unmuteExecuted).toHaveBeenCalledTimes(1);
    expect(muteExecuted).not.toHaveBeenCalled();
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(true);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is unmuted in sdk, when calling unmute from hook, unmute should not be called again in sdk', async () => {
    // Arrange
    microphoneMutedInitialState = true;
    const callAgent = mockCallAgent({
      ...defaultMockCallProps,
      muteExecutedCallback: muteExecuted,
      unmuteExecutedCallback: unmuteExecuted,
      isMicrophoneMuted: microphoneMutedInitialState
    });
    callAgent.calls[0].isMuted = false;
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: callAgent as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.unmute();

    // Assert
    expect(unmuteExecuted).not.toHaveBeenCalledTimes(1);
    expect(muteExecuted).not.toHaveBeenCalled();
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(true);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is unmuted, unmute mic should mute the microphone', async () => {
    // Arrange
    microphoneMutedInitialState = false;
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.mute();

    // Assert
    expect(muteExecuted).toHaveBeenCalled();
    expect(unmuteExecuted).not.toHaveBeenCalledTimes(1);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(false);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is muted in sdk, when calling mute from hook, mute should not be called again in sdk', async () => {
    // Arrange
    microphoneMutedInitialState = false;
    const callAgent = mockCallAgent({
      ...defaultMockCallProps,
      muteExecutedCallback: muteExecuted,
      unmuteExecutedCallback: unmuteExecuted,
      isMicrophoneMuted: microphoneMutedInitialState
    });
    callAgent.calls[0].isMuted = true;
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: callAgent as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.mute();

    // Assert
    expect(muteExecuted).not.toHaveBeenCalled();
    expect(unmuteExecuted).not.toHaveBeenCalledTimes(1);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(false);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is muted, microphone should be unmuted by calling toggle', async () => {
    // Arrange
    microphoneMutedInitialState = true;
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.toggle();

    // Assert
    expect(unmuteExecuted).toHaveBeenCalledTimes(1);
    expect(muteExecuted).not.toHaveBeenCalled();
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(true);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone is unmuted, microphone should be muted by calling toggle', async () => {
    // Arrange
    microphoneMutedInitialState = false;
    const { result } = renderHook(() => useMicrophone());

    // Act
    await result.current.toggle();

    // Assert
    expect(muteExecuted).toHaveBeenCalledTimes(1);
    expect(unmuteExecuted).not.toHaveBeenCalled();
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledWith(false);
    expect(setIsMicrophoneEnabledMock).toHaveBeenCalledTimes(1);
  });

  test('if microphone unmute is called without microphone permission, an error should be thrown and sdk unmute call should not be made', async () => {
    // Arrange
    microphoneMutedInitialState = false;
    microphonePermissionInitialState = 'Denied';
    const { result } = renderHook(() => useMicrophone());

    let caughtError;
    // Act
    try {
      await result.current.unmute();
    } catch (error) {
      caughtError = error;
    }

    // Assert
    expect(muteExecuted).not.toHaveBeenCalledTimes(1);
    expect(setIsMicrophoneEnabledMock).not.toHaveBeenLastCalledWith(1);
    expect(caughtError).toBeDefined();
    expect(caughtError.message).toBe('Cannot unmute microphone - microphone permission has not been granted.');
  });

  test('if call unmute throws an error, useMicrophone is expected wrap it in CommunicationUiError and rethrow', async () => {
    // Arrange
    microphoneMutedInitialState = true;
    const callAgent = mockCallAgent({
      ...defaultMockCallProps,
      muteExecutedCallback: muteExecuted,
      unmuteExecutedCallback: unmuteExecuted,
      isMicrophoneMuted: microphoneMutedInitialState
    });
    callAgent.calls[0].unmute = () => {
      return Promise.reject(new Error('unmute failed'));
    };
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: callAgent as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
    const { result } = renderHook(() => useMicrophone());

    // Act
    let caughtError;
    try {
      await result.current.unmute();
    } catch (error) {
      caughtError = error;
    }

    // Assert
    expect(caughtError).toBeDefined();
    expect(caughtError instanceof CommunicationUiError).toBe(true);
    expect(caughtError.message).toBe('Error unmuting microphone');
  });

  test('if call mute throws an error, useMicrophone is expected to wrap it in CommunicationUiError and rethrow', async () => {
    // Arrange
    const callAgent = mockCallAgent({
      ...defaultMockCallProps,
      muteExecutedCallback: muteExecuted,
      unmuteExecutedCallback: unmuteExecuted,
      isMicrophoneMuted: microphoneMutedInitialState
    });
    callAgent.calls[0].mute = () => {
      return Promise.reject(new Error('mute failed'));
    };
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: callAgent as any,
        audioDevicePermission: microphonePermissionInitialState
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        isMicrophoneEnabled: !microphoneMutedInitialState,
        setIsMicrophoneEnabled: setIsMicrophoneEnabledMock
      };
    };
    const { result } = renderHook(() => useMicrophone());

    // Act
    let caughtError;
    try {
      await result.current.mute();
    } catch (error) {
      caughtError = error;
    }

    // Assert
    expect(caughtError).toBeDefined();
    expect(caughtError instanceof CommunicationUiError).toBe(true);
    expect(caughtError.message).toBe('Error muting microphone');
  });
});
