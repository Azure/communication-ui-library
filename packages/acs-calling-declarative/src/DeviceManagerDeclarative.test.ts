// © Microsoft Corporation. All rights reserved.

import {
  AudioDeviceInfo,
  AudioDeviceType,
  CollectionUpdatedEvent,
  DeviceAccess,
  DeviceManager,
  PropertyChangedEvent,
  VideoDeviceInfo,
  VideoDeviceType
} from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { deviceManagerDeclaratify } from './DeviceManagerDeclarative';
import EventEmitter from 'events';
import { waitWithBreakCondition } from './TestUtils';

jest.mock('@azure/communication-calling');

class MockDeviceManager implements DeviceManager {
  emitter = new EventEmitter();
  isSpeakerSelectionAvailable = false;
  selectedMicrophone = {
    name: 'selected_microphone',
    id: '1',
    isSystemDefault: true,
    deviceType: 'Microphone' as AudioDeviceType
  };
  selectedSpeaker = {
    name: 'selected_speaker',
    id: '2',
    isSystemDefault: true,
    deviceType: 'Speaker' as AudioDeviceType
  };
  getCameras = (): Promise<VideoDeviceInfo[]> => {
    return new Promise((resolve) => {
      resolve([
        {
          name: 'camera',
          id: '3',
          deviceType: 'UsbCamera' as VideoDeviceType
        }
      ]);
    });
  };
  getMicrophones(): Promise<AudioDeviceInfo[]> {
    return new Promise((resolve) => {
      resolve([
        {
          name: 'microphone',
          id: '4',
          isSystemDefault: false,
          deviceType: 'Microphone' as AudioDeviceType
        }
      ]);
    });
  }
  getSpeakers(): Promise<AudioDeviceInfo[]> {
    return new Promise((resolve) => {
      resolve([
        {
          name: 'speaker',
          id: '5',
          isSystemDefault: false,
          deviceType: 'Speaker' as AudioDeviceType
        }
      ]);
    });
  }
  selectMicrophone(microphoneDevice: AudioDeviceInfo): Promise<void> {
    return new Promise((resolve) => {
      this.selectedMicrophone = microphoneDevice;
      resolve();
    });
  }
  selectSpeaker(speakerDevice: AudioDeviceInfo): Promise<void> {
    return new Promise((resolve) => {
      this.selectedSpeaker = speakerDevice;
      resolve();
    });
  }
  askDevicePermission(): Promise<DeviceAccess> {
    return new Promise((resolve) => {
      resolve({
        audio: true,
        video: true
      });
    });
  }
  on(event: 'videoDevicesUpdated', listener: CollectionUpdatedEvent<VideoDeviceInfo>): void;
  on(event: 'audioDevicesUpdated', listener: CollectionUpdatedEvent<AudioDeviceInfo>): void;
  on(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  on(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  on(event: any, listener: any): void {
    this.emitter.on(event, listener);
  }
  off(event: 'videoDevicesUpdated', listener: CollectionUpdatedEvent<VideoDeviceInfo>): void;
  off(event: 'audioDevicesUpdated', listener: CollectionUpdatedEvent<AudioDeviceInfo>): void;
  off(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  off(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  off(event: any, listener: any): void {
    this.emitter.off(event, listener);
  }
  emit(event: 'videoDevicesUpdated', data: any): void;
  emit(event: 'audioDevicesUpdated', data: any): void;
  emit(event: 'selectedMicrophoneChanged', data: any): void;
  emit(event: 'selectedSpeakerChanged', data: any): void;
  emit(event: any, data: any): void {
    this.emitter.emit(event, data);
  }
}

function createDeclarativeDeviceManager(): {
  declarativeDeviceManager: DeviceManager;
  mockDeviceManager: MockDeviceManager;
  callContext: CallContext;
} {
  const mockDeviceManager = new MockDeviceManager();
  const context = new CallContext();
  return {
    declarativeDeviceManager: deviceManagerDeclaratify(mockDeviceManager, context),
    mockDeviceManager: mockDeviceManager,
    callContext: context
  };
}

describe('declarative device manager', () => {
  test('should proxy getCameras and update cameras in state', async () => {
    const { declarativeDeviceManager, callContext } = createDeclarativeDeviceManager();
    const cameras = await declarativeDeviceManager.getCameras();
    expect(cameras.length).toBe(1);
    expect(cameras[0].name).toBe('camera');
    expect(callContext.getState().deviceManagerState.cameras.length).toBe(1);
    expect(callContext.getState().deviceManagerState.cameras[0].name).toBe('camera');
  });

  test('should proxy getMicrophones and update microphones in state', async () => {
    const { declarativeDeviceManager, callContext } = createDeclarativeDeviceManager();
    const microphones = await declarativeDeviceManager.getMicrophones();
    expect(microphones.length).toBe(1);
    expect(microphones[0].name).toBe('microphone');
    expect(callContext.getState().deviceManagerState.microphones.length).toBe(1);
    expect(callContext.getState().deviceManagerState.microphones[0].name).toBe('microphone');
  });

  test('should proxy getSpeakers and update speakers in state', async () => {
    const { declarativeDeviceManager, callContext } = createDeclarativeDeviceManager();
    const speakers = await declarativeDeviceManager.getSpeakers();
    expect(speakers.length).toBe(1);
    expect(speakers[0].name).toBe('speaker');
    expect(callContext.getState().deviceManagerState.speakers.length).toBe(1);
    expect(callContext.getState().deviceManagerState.speakers[0].name).toBe('speaker');
  });

  test('should proxy selectMicrophone and update selectedMicrophone in state', async () => {
    const { declarativeDeviceManager, callContext } = createDeclarativeDeviceManager();
    await declarativeDeviceManager.selectMicrophone({
      name: 'new_selected_microphone',
      id: '6',
      isSystemDefault: false,
      deviceType: 'Microphone' as AudioDeviceType
    });
    expect(callContext.getState().deviceManagerState.selectedMicrophone).toBeDefined();
    expect(callContext.getState().deviceManagerState.selectedMicrophone?.name).toBe('new_selected_microphone');
  });

  test('should proxy selectSpeaker and update selectedSpeaker in state', async () => {
    const { declarativeDeviceManager, callContext } = createDeclarativeDeviceManager();
    await declarativeDeviceManager.selectSpeaker({
      name: 'new_selected_speaker',
      id: '6',
      isSystemDefault: false,
      deviceType: 'Speaker' as AudioDeviceType
    });
    expect(callContext.getState().deviceManagerState.selectedSpeaker).toBeDefined();
    expect(callContext.getState().deviceManagerState.selectedSpeaker?.name).toBe('new_selected_speaker');
  });

  test('should proxy askDevicePermission and update deviceAccess in state', async () => {
    const { declarativeDeviceManager, callContext } = createDeclarativeDeviceManager();
    const deviceAccess = await declarativeDeviceManager.askDevicePermission({ audio: false, video: false });
    expect(deviceAccess.audio).toBe(true);
    expect(deviceAccess.video).toBe(true);
    expect(callContext.getState().deviceManagerState.deviceAccess).toBeDefined();
    expect(callContext.getState().deviceManagerState.deviceAccess?.audio).toBe(true);
    expect(callContext.getState().deviceManagerState.deviceAccess?.video).toBe(true);
  });

  test('should detect videoDevicesUpdated and update cameras in state using deviceManager', async () => {
    const { mockDeviceManager, callContext } = createDeclarativeDeviceManager();
    mockDeviceManager.emit('videoDevicesUpdated', {});
    await waitWithBreakCondition(() => callContext.getState().deviceManagerState.cameras.length !== 0);
    expect(callContext.getState().deviceManagerState.cameras.length).toBe(1);
    expect(callContext.getState().deviceManagerState.cameras[0].name).toBe('camera');
  });

  test('should detect audioDevicesUpdated update microphones/speakers in state using deviceManager', async () => {
    const { mockDeviceManager, callContext } = createDeclarativeDeviceManager();
    mockDeviceManager.emit('audioDevicesUpdated', {});
    await waitWithBreakCondition(
      () =>
        callContext.getState().deviceManagerState.microphones.length !== 0 &&
        callContext.getState().deviceManagerState.speakers.length !== 0
    );
    expect(callContext.getState().deviceManagerState.speakers.length).toBe(1);
    expect(callContext.getState().deviceManagerState.speakers[0].name).toBe('speaker');
    expect(callContext.getState().deviceManagerState.microphones.length).toBe(1);
    expect(callContext.getState().deviceManagerState.microphones[0].name).toBe('microphone');
  });

  test('should detect selectedMicrophoneChanged update selectedMicrophone in state using deviceManager', async () => {
    const { mockDeviceManager, callContext } = createDeclarativeDeviceManager();
    mockDeviceManager.emit('selectedMicrophoneChanged', {});
    await waitWithBreakCondition(() => callContext.getState().deviceManagerState.selectedMicrophone !== undefined);
    expect(callContext.getState().deviceManagerState.selectedMicrophone).toBeDefined();
    expect(callContext.getState().deviceManagerState.selectedMicrophone?.name).toBe('selected_microphone');
  });

  test('should detect selectedSpeakerChanged update selectedSpeaker in state using deviceManager', async () => {
    const { mockDeviceManager, callContext } = createDeclarativeDeviceManager();
    mockDeviceManager.emit('selectedSpeakerChanged', {});
    await waitWithBreakCondition(() => callContext.getState().deviceManagerState.selectedSpeaker !== undefined);
    expect(callContext.getState().deviceManagerState.selectedSpeaker).toBeDefined();
    expect(callContext.getState().deviceManagerState.selectedSpeaker?.name).toBe('selected_speaker');
  });
});
