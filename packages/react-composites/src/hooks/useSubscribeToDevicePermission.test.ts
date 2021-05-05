// © Microsoft Corporation. All rights reserved.

import { renderHook } from '@testing-library/react-hooks';
import { DeviceAccess, DeviceManager } from '@azure/communication-calling';
import useSubscribeToDevicePermission from './useSubscribeToDevicePermission';
import React from 'react';
import { createSpyObj } from '../mocks';
import { act } from 'react-dom/test-utils';
import { MockCallingProvider } from '../mocks/MockCallingProvider';

jest.mock('@azure/communication-calling', () => {
  return {
    CallClient: jest.fn().mockImplementation(() => {
      return {};
    }),
    CallAgent: {},
    DeviceManager: {}
  };
});

jest.mock('../providers/ErrorProvider', () => {
  return {
    useTriggerOnErrorCallback: jest.fn()
  };
});

let setAudioDevicePermissionCallback: jest.Mock<any, any>;
let setVideoDevicePermissionCallback: jest.Mock<any, any>;
const ReactUseContext = React.useContext;

describe('useSubscribeToDevicePermission tests', () => {
  let tsDeviceManagerMock: jest.Mocked<DeviceManager>;

  beforeEach(() => {
    setAudioDevicePermissionCallback = jest.fn();
    setVideoDevicePermissionCallback = jest.fn();
    tsDeviceManagerMock = createSpyObj<DeviceManager>('tsDeviceManagerMock', ['askDevicePermission', 'on', 'off']);
    tsDeviceManagerMock.askDevicePermission.mockImplementation(
      (): Promise<DeviceAccess> => {
        return Promise.resolve({ audio: true, video: true });
      }
    );
    React.useContext = jest.fn().mockImplementation(() => {
      return {
        setAudioDevicePermission: (state: string) => {
          setAudioDevicePermissionCallback(state);
        },
        setVideoDevicePermission: (state: string) => {
          setVideoDevicePermissionCallback(state);
        },
        videoDevicePermission: 'Unknown',
        deviceManager: tsDeviceManagerMock
      };
    });
  });

  afterEach(() => {
    React.useContext = ReactUseContext;
  });

  test('useSubscribeToDevicePermission hook should throw error if useContext is undefined ', async () => {
    React.useContext = jest.fn().mockImplementation(() => {
      return undefined;
    });

    expect(() => {
      renderHook(() => useSubscribeToDevicePermission('Camera'), {
        wrapper: MockCallingProvider
      }).result.current;
    }).toThrowError(new Error('CallingContext is undefined'));
  });

  test('useSubscribeToDevicePermission hook should ask user for permission if permission state is unknown', async () => {
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: MockCallingProvider
    });
    await waitForNextUpdate();
    expect(tsDeviceManagerMock.askDevicePermission).toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should not ask user for permission if permission state is Granted', async () => {
    // 1. First call will ask for permission
    tsDeviceManagerMock.askDevicePermission.mockImplementation(
      (): Promise<DeviceAccess> => {
        return Promise.resolve({ audio: true, video: true });
      }
    );
    const { waitForNextUpdate, rerender } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: MockCallingProvider
    });
    await waitForNextUpdate();
    expect(tsDeviceManagerMock.askDevicePermission).toBeCalled();

    // Second call will not ask for permission as it was already denied
    tsDeviceManagerMock.askDevicePermission.mockClear();
    act(() => {
      rerender();
    });
    expect(tsDeviceManagerMock.askDevicePermission).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should not ask user for permission if permission state is Denied', async () => {
    // 1. First call will ask for permission
    tsDeviceManagerMock.askDevicePermission.mockImplementation(
      (): Promise<DeviceAccess> => {
        return Promise.resolve({ audio: false, video: false });
      }
    );
    const { waitForNextUpdate, rerender } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: MockCallingProvider
    });
    await waitForNextUpdate();
    expect(tsDeviceManagerMock.askDevicePermission).toBeCalled();

    // Second call will not ask for permission as it was already denied
    tsDeviceManagerMock.askDevicePermission.mockClear();
    act(() => {
      rerender();
    });
    expect(tsDeviceManagerMock.askDevicePermission).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should set videoDevicePermission with Granted if video permission is true', async () => {
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: MockCallingProvider
    });
    await waitForNextUpdate();
    expect(setVideoDevicePermissionCallback).toBeCalledWith('Granted');
    expect(setAudioDevicePermissionCallback).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should set videoDevicePermission with Denied if video permission is false', async () => {
    tsDeviceManagerMock.askDevicePermission.mockImplementation(
      (): Promise<DeviceAccess> => {
        return Promise.resolve({ audio: false, video: false });
      }
    );
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: MockCallingProvider
    });
    await waitForNextUpdate();
    expect(setVideoDevicePermissionCallback).toBeCalledWith('Denied');
    expect(setAudioDevicePermissionCallback).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should set audioDevicePermission with Granted if audio permission is true', async () => {
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Microphone'), {
      wrapper: MockCallingProvider
    });
    await waitForNextUpdate();
    expect(setAudioDevicePermissionCallback).toBeCalledWith('Granted');
    expect(setVideoDevicePermissionCallback).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should set audioDevicePermission with Denied if audio permission is false', async () => {
    tsDeviceManagerMock.askDevicePermission.mockImplementation(
      (): Promise<DeviceAccess> => {
        return Promise.resolve({ audio: false, video: false });
      }
    );
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Microphone'), {
      wrapper: MockCallingProvider
    });
    await waitForNextUpdate();
    expect(setAudioDevicePermissionCallback).toBeCalledWith('Denied');
    expect(setVideoDevicePermissionCallback).not.toBeCalled();
  });
});
