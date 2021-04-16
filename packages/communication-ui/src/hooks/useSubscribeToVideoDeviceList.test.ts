// © Microsoft Corporation. All rights reserved.

import { act, renderHook } from '@testing-library/react-hooks';
import { DeviceManager, VideoDeviceInfo } from '@azure/communication-calling';
import useSubscribeToVideoDeviceList from './useSubscribeToVideoDeviceList';
import { createSpyObj, waitWithBreakCondition } from '../mocks';
import { useCallingContext } from '../providers';

jest.mock('@azure/communication-calling', () => {
  return {
    CallClient: jest.fn().mockImplementation(() => {
      return {};
    })
  };
});

const mockFrontCamera = { name: 'Microsoft Camera Front', id: 'camera:54321' } as VideoDeviceInfo;
const mockRearCamera = { name: 'Microsoft Camera Rear', id: 'camera:12345' } as VideoDeviceInfo;
const mockCameraList = [mockFrontCamera, mockRearCamera];

type MockCallingContextType = {
  videoDevicePermission: string;
  videoDeviceList: VideoDeviceInfo[] | undefined;
  setVideoDeviceList(newList: VideoDeviceInfo[]): void;
  videoDeviceInfo: VideoDeviceInfo | undefined;
  setVideoDeviceInfo(newInfo: VideoDeviceInfo): void;
  deviceManager: DeviceManager;
};

let mockCallingContext: () => MockCallingContextType;

jest.mock('../providers', () => {
  return {
    useCallingContext: jest.fn().mockImplementation(
      (): MockCallingContextType => {
        return mockCallingContext();
      }
    )
  };
});

describe('useSubscribeToVideoDeviceList tests', () => {
  let callbacks: { [name: string]: () => void };

  beforeEach(() => {
    callbacks = {};

    const deviceManagerMock = createSpyObj<DeviceManager>('deviceManagerMock', ['getCameras', 'on', 'off']);
    deviceManagerMock.on.mockImplementation((name: string, callback: () => void) => {
      callbacks[name] = callback;
    });
    deviceManagerMock.off.mockImplementation(() => {
      return;
    });
    deviceManagerMock.getCameras.mockImplementation(async () => {
      return mockCameraList;
    });

    let videoDeviceinfoValue: VideoDeviceInfo | undefined = undefined;
    let videoDeviceListValue: VideoDeviceInfo[] | undefined = undefined;
    mockCallingContext = jest.fn().mockImplementation(
      (): MockCallingContextType => {
        return {
          videoDevicePermission: 'Granted',
          videoDeviceInfo: videoDeviceinfoValue,
          setVideoDeviceInfo: (newInfo: VideoDeviceInfo): void => {
            videoDeviceinfoValue = newInfo;
          },
          videoDeviceList: videoDeviceListValue,
          setVideoDeviceList: (newList: VideoDeviceInfo[]) => {
            videoDeviceListValue = newList;
          },
          deviceManager: deviceManagerMock
        };
      }
    );
  });

  test('useSubscribeToVideoDeviceList hook should not fetch the list if permission was denied ', async () => {
    mockCallingContext = jest.fn().mockImplementation(
      (): MockCallingContextType => {
        return {
          ...mockCallingContext(),
          videoDevicePermission: 'Denied'
        };
      }
    );
    renderHook(() => useSubscribeToVideoDeviceList());
    const callback = callbacks.videoDevicesUpdated;
    expect(callback).toBeUndefined();
  });

  test('useSubscribeToVideoDeviceList hook should update the videoDeviceList state when the callback onVideoDevicesUpdated is fired ', async () => {
    renderHook(() => useSubscribeToVideoDeviceList());
    const callback = callbacks.videoDevicesUpdated;
    expect(callback).toBeTruthy();
    act(callback);
    await waitWithBreakCondition(() => useCallingContext().videoDeviceList !== undefined);
    expect(useCallingContext().videoDeviceList).toBe(mockCameraList);
  });

  test('useSubscribeToVideoDeviceList hook should update the videoDeviceInfo state when the callback onVideoDevicesUpdated is fired ', async () => {
    renderHook(() => useSubscribeToVideoDeviceList());
    const callback = callbacks.videoDevicesUpdated;
    expect(callback).toBeTruthy();
    act(callback);
    await waitWithBreakCondition(() => useCallingContext().videoDeviceInfo !== undefined);
    expect(useCallingContext().videoDeviceInfo).toBe(mockFrontCamera);
  });
});
