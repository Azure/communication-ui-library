// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { renderHook } from '@testing-library/react-hooks';
import { CallAgent } from '@azure/communication-calling';
import useScreenShare from './useScreenShare';
import { defaultMockCallProps, mockCallAgent } from '../mocks';

type MockCallingContextType = {
  callAgent: CallAgent;
};

type MockCallContextType = {
  localScreenShareActive: boolean;
  setLocalScreenShare: jest.Mock<any, any>;
};

let isStartScreenSharingExecuted = jest.fn();
let isStopScreenSharingExecuted = jest.fn();
let setScreenShare = jest.fn();
let initialScreenShareState: boolean;

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

describe('useScreenShare tests', () => {
  beforeEach(() => {
    initialScreenShareState = false;
    isStartScreenSharingExecuted = jest.fn();
    isStopScreenSharingExecuted = jest.fn();
    setScreenShare = jest.fn();
    mockCallingContext = (): MockCallingContextType => {
      return {
        // TODO: fix typescript types
        callAgent: mockCallAgent({
          ...defaultMockCallProps,
          isStartScreenSharingExecuted,
          isStopScreenSharingExecuted,
          isScreenSharingOn: initialScreenShareState
        }) as any
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        localScreenShareActive: initialScreenShareState,
        setLocalScreenShare: setScreenShare
      };
    };
  });

  test('if screen is not being shared, startScreenShare will start screen sharing', async () => {
    // Arrange
    initialScreenShareState = false;
    const { result } = renderHook(() => useScreenShare());

    // Act
    await result.current.startScreenShare();

    // Assert
    expect(setScreenShare).toHaveBeenCalledWith(true);
    expect(setScreenShare).toHaveBeenCalledTimes(1);
    expect(isStartScreenSharingExecuted).toHaveBeenCalledTimes(1);
  });

  test('if screen is being shared, stopScreenShare will stop screen sharing', async () => {
    // Arrange
    initialScreenShareState = true;
    const { result } = renderHook(() => useScreenShare());

    // Act
    await result.current.stopScreenShare();

    // Assert
    expect(setScreenShare).toHaveBeenCalledWith(false);
    expect(setScreenShare).toHaveBeenCalledTimes(1);
    expect(isStopScreenSharingExecuted).toHaveBeenCalledTimes(1);
  });

  test('if screen is being shared, state of screen share should be stopped after calling toggle', async () => {
    // Arrange
    initialScreenShareState = true;
    const { result } = renderHook(() => useScreenShare());

    // Act
    await result.current.toggleScreenShare();

    // Assert
    expect(setScreenShare).toHaveBeenCalledWith(false);
    expect(setScreenShare).toHaveBeenCalledTimes(1);
    expect(isStartScreenSharingExecuted).not.toHaveBeenCalled();
    expect(isStopScreenSharingExecuted).toHaveBeenCalledTimes(1);
  });

  test('if screen is not being shared, state of screen share should be shared after calling toggle', async () => {
    // Arrange
    initialScreenShareState = false;
    const { result } = renderHook(() => useScreenShare());

    // Act
    await result.current.toggleScreenShare();

    // Assert
    expect(setScreenShare).toHaveBeenCalledWith(true);
    expect(setScreenShare).toHaveBeenCalledTimes(1);
    expect(isStartScreenSharingExecuted).toHaveBeenCalledTimes(1);
    expect(isStopScreenSharingExecuted).not.toHaveBeenCalled();
  });
});
