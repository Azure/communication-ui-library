// © Microsoft Corporation. All rights reserved.

import { act, renderHook } from '@testing-library/react-hooks';
import { AudioDeviceInfo, DeviceManager } from '@azure/communication-calling';
import useSubscribeToAudioDeviceList from './useSubscribeToAudioDeviceList';
import { createSpyObj, waitWithBreakCondition } from '../mocks';
import { useCallingContext } from '../providers';

jest.mock('@azure/communication-calling', () => {
  return {
    CallClient: jest.fn().mockImplementation(() => {
      return {};
    })
  };
});

const mockPrimaryMicrophone: AudioDeviceInfo = {
  name: 'Microphone',
  id: 'mic:12345',
  isSystemDefault: true,
  deviceType: 'Microphone'
};
const mockSecondaryMicrophone: AudioDeviceInfo = {
  name: 'Microphone 2',
  id: 'mic:54321',
  isSystemDefault: true,
  deviceType: 'Microphone'
};
const mockMicrophoneList = [mockPrimaryMicrophone, mockSecondaryMicrophone];

type MockCallingContextType = {
  audioDevicePermission: string;
  audioDeviceList: AudioDeviceInfo[] | undefined;
  setAudioDeviceList(newList: AudioDeviceInfo[]): void;
  audioDeviceInfo: AudioDeviceInfo | undefined;
  setAudioDeviceInfo(newInfo: AudioDeviceInfo): void;
  deviceManager: DeviceManager | undefined;
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

describe('useSubscribeToAudioDeviceList tests', () => {
  let callbacks: { [name: string]: () => void };

  beforeEach(() => {
    callbacks = {};
    const deviceManagerMock = createSpyObj<DeviceManager>('deviceManagerMock', [
      'getMicrophones',
      'selectMicrophone',
      'on',
      'off'
    ]);
    deviceManagerMock.on.mockImplementation((name: string, callback: () => void) => {
      callbacks[name] = callback;
    });
    let audioDeviceinfoValue: AudioDeviceInfo | undefined = undefined;
    let audioDeviceListValue: AudioDeviceInfo[] | undefined = undefined;
    mockCallingContext = jest.fn().mockImplementation(
      (): MockCallingContextType => {
        return {
          audioDevicePermission: 'Granted',
          audioDeviceInfo: audioDeviceinfoValue,
          setAudioDeviceInfo: (newInfo: AudioDeviceInfo): void => {
            audioDeviceinfoValue = newInfo;
          },
          audioDeviceList: audioDeviceListValue,
          setAudioDeviceList: (newList: AudioDeviceInfo[]) => {
            audioDeviceListValue = newList;
          },
          deviceManager: deviceManagerMock
        };
      }
    );
    deviceManagerMock.off.mockImplementation(() => {
      return;
    });
    deviceManagerMock.getMicrophones.mockImplementation(async () => {
      return mockMicrophoneList;
    });
  });

  test('useSubscribeToAudioDeviceList hook should not fetch the list if permission was denied ', async () => {
    mockCallingContext = jest.fn().mockImplementation(
      (): MockCallingContextType => {
        return {
          ...mockCallingContext(),
          audioDevicePermission: 'Denied'
        };
      }
    );
    renderHook(() => useSubscribeToAudioDeviceList());
    const callback = callbacks.audioDevicesUpdated;
    expect(callback).toBeUndefined();
  });

  test('useSubscribeToAudioDeviceList hook should not fetch the list if deviceManager was undefined ', async () => {
    mockCallingContext = jest.fn().mockImplementation(
      (): MockCallingContextType => {
        return {
          ...mockCallingContext(),
          deviceManager: undefined
        };
      }
    );
    renderHook(() => useSubscribeToAudioDeviceList());
    expect(callbacks).toStrictEqual({});
  });

  test('useSubscribeToAudioDeviceList hook should update the audioDeviceList state when the callback onAudioDevicesUpdated is fired ', async () => {
    renderHook(() => useSubscribeToAudioDeviceList());
    const callback = callbacks.audioDevicesUpdated;
    expect(callback).toBeTruthy();
    act(callback);
    await waitWithBreakCondition(() => useCallingContext().audioDeviceList !== undefined);
    expect(useCallingContext().audioDeviceList).toBe(mockMicrophoneList);
  });

  test('useSubscribeToAudioDeviceList hook should update the audioDeviceInfo state when the callback onAudioDevicesUpdated is fired ', async () => {
    renderHook(() => useSubscribeToAudioDeviceList());
    const callback = callbacks.audioDevicesUpdated;
    expect(callback).toBeTruthy();
    act(callback);
    await waitWithBreakCondition(() => useCallingContext().audioDeviceInfo !== undefined);
    expect(useCallingContext().audioDeviceInfo).toBe(mockPrimaryMicrophone);
  });
});
