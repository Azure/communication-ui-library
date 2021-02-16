// © Microsoft Corporation. All rights reserved.

import { renderHook } from '@testing-library/react-hooks';
import { DeviceAccess, DeviceManager, PermissionState } from '@azure/communication-calling';
import useSubscribeToDevicePermission from './useSubscribeToDevicePermission';
import { CallingProvider } from '../providers';
import React from 'react';
import { createSpyObj } from '../mocks';

jest.mock('@azure/communication-calling', () => {
  return {
    CallClient: jest.fn().mockImplementation(() => {
      return {};
    }),
    CallAgent: {},
    DeviceManager: {}
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
    tsDeviceManagerMock = createSpyObj<DeviceManager>('tsDeviceManagerMock', [
      'getPermissionState',
      'askDevicePermission',
      'on',
      'off'
    ]);
    tsDeviceManagerMock.getPermissionState.mockImplementation(
      (): Promise<PermissionState> => {
        return Promise.resolve('Unknown');
      }
    );
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
        wrapper: CallingProvider
      }).result.current;
    }).toThrowError(new Error('Calling Context does not exist'));
  });

  test('useSubscribeToDevicePermission hook should ask user for permission if permission state is unknown', async () => {
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: CallingProvider
    });
    await waitForNextUpdate();
    expect(tsDeviceManagerMock.getPermissionState).toBeCalled();
    expect(tsDeviceManagerMock.askDevicePermission).toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should ask user for permission if permission state is Prompt', async () => {
    tsDeviceManagerMock.getPermissionState.mockImplementation(
      (): Promise<PermissionState> => {
        return Promise.resolve('Prompt');
      }
    );
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: CallingProvider
    });
    await waitForNextUpdate();
    expect(tsDeviceManagerMock.getPermissionState).toBeCalled();
    expect(tsDeviceManagerMock.askDevicePermission).toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should not ask user for permission if permission state is Granted', async () => {
    tsDeviceManagerMock.getPermissionState.mockImplementation(
      (): Promise<PermissionState> => {
        return Promise.resolve('Granted');
      }
    );
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: CallingProvider
    });
    await waitForNextUpdate();
    expect(tsDeviceManagerMock.getPermissionState).toBeCalled();
    expect(tsDeviceManagerMock.askDevicePermission).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should not ask user for permission if permission state is Denied', async () => {
    tsDeviceManagerMock.getPermissionState.mockImplementation(
      (): Promise<PermissionState> => {
        return Promise.resolve('Denied');
      }
    );
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: CallingProvider
    });
    await waitForNextUpdate();
    expect(tsDeviceManagerMock.getPermissionState).toBeCalled();
    expect(tsDeviceManagerMock.askDevicePermission).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should set videoDevicePermission with Granted if video permission is true', async () => {
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: CallingProvider
    });
    await waitForNextUpdate();
    expect(setVideoDevicePermissionCallback).toBeCalledWith('Granted');
    expect(setAudioDevicePermissionCallback).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should set videoDevicePermission with Denied if video permission is false', async () => {
    tsDeviceManagerMock.askDevicePermission.mockImplementation(
      (): Promise<DeviceAccess> => {
        return Promise.resolve({ video: false });
      }
    );
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Camera'), {
      wrapper: CallingProvider
    });
    await waitForNextUpdate();
    expect(setVideoDevicePermissionCallback).toBeCalledWith('Denied');
    expect(setAudioDevicePermissionCallback).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should set audioDevicePermission with Granted if audio permission is true', async () => {
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Microphone'), {
      wrapper: CallingProvider
    });
    await waitForNextUpdate();
    expect(setAudioDevicePermissionCallback).toBeCalledWith('Granted');
    expect(setVideoDevicePermissionCallback).not.toBeCalled();
  });

  test('useSubscribeToDevicePermission hook should set audioDevicePermission with Denied if audio permission is false', async () => {
    tsDeviceManagerMock.askDevicePermission.mockImplementation(
      (): Promise<DeviceAccess> => {
        return Promise.resolve({ audio: false });
      }
    );
    const { waitForNextUpdate } = renderHook(() => useSubscribeToDevicePermission('Microphone'), {
      wrapper: CallingProvider
    });
    await waitForNextUpdate();
    expect(setAudioDevicePermissionCallback).toBeCalledWith('Denied');
    expect(setVideoDevicePermissionCallback).not.toBeCalled();
  });
});
