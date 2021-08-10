// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
import { addMockEmitter, createMockCallAgent, createMockCallClient, waitWithBreakCondition } from './TestUtils';
import { createStatefulCallClientWithDeps, StatefulCallClient } from './StatefulCallClient';
import { InternalCallContext } from './InternalCallContext';

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
  const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
  return {
    declarativeDeviceManager: deviceManagerDeclaratify(mockDeviceManager, context),
    mockDeviceManager: mockDeviceManager,
    callContext: context
  };
}

describe('declarative device manager', () => {
  test('should proxy getCameras and update cameras in state', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      createMockDeviceManagerWithCameras([{ name: 'camera', id: '3', deviceType: 'UsbCamera' as VideoDeviceType }])
    );

    const cameras = await (await client.getDeviceManager()).getCameras();
    expect(cameras.length).toBe(1);
    expect(cameras[0].name).toBe('camera');

    expect(client.getState().deviceManager.cameras.length).toBe(1);
    expect(client.getState().deviceManager.cameras[0].name).toBe('camera');
  });

  test('should detect videoDevicesUpdated and update cameras in state using deviceManager', async () => {
    const { mockDeviceManager, callContext } = createDeclarativeDeviceManager();
    mockDeviceManager.emit('videoDevicesUpdated', {});
    await waitWithBreakCondition(() => callContext.getState().deviceManager.cameras.length !== 0);
    expect(callContext.getState().deviceManager.cameras.length).toBe(1);
    expect(callContext.getState().deviceManager.cameras[0].name).toBe('camera');
  });

  test('should proxy getMicrophones and update microphones in state', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      createMockDeviceManagerWithMicrophones([
        {
          name: 'microphone',
          id: '4',
          isSystemDefault: false,
          deviceType: 'Microphone' as AudioDeviceType
        }
      ])
    );

    const microphones = await (await client.getDeviceManager()).getMicrophones();
    expect(microphones.length).toBe(1);
    expect(microphones[0].name).toBe('microphone');

    expect(client.getState().deviceManager.microphones.length).toBe(1);
    expect(client.getState().deviceManager.microphones[0].name).toBe('microphone');
  });

  test('should proxy selectMicrophone and update selectedMicrophone in state', async () => {
    const microphone = {
      name: 'microphone',
      id: '4',
      isSystemDefault: false,
      deviceType: 'Microphone' as AudioDeviceType
    };
    const client = createStatefulCallClientWithDeviceManager(createMockDeviceManagerWithMicrophones([microphone]));

    expect(client.getState().deviceManager.selectedMicrophone).not.toBeDefined();

    await (await client.getDeviceManager()).selectMicrophone(microphone);
    expect(client.getState().deviceManager.selectedMicrophone).toBeDefined();
    expect(client.getState().deviceManager.selectedMicrophone?.name).toBe('microphone');
  });

  test('should proxy getSpeakers and update speakers in state', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      createMockDeviceManagerWithSpeakers([
        {
          name: 'speaker',
          id: '5',
          isSystemDefault: false,
          deviceType: 'Speaker' as AudioDeviceType
        }
      ])
    );

    const speakers = await (await client.getDeviceManager()).getSpeakers();
    expect(speakers.length).toBe(1);
    expect(speakers[0].name).toBe('speaker');

    expect(client.getState().deviceManager.speakers.length).toBe(1);
    expect(client.getState().deviceManager.speakers[0].name).toBe('speaker');
  });

  test('should proxy selectSpeaker and update selectedSpeaker in state', async () => {
    const speaker = {
      name: 'speaker',
      id: '5',
      isSystemDefault: false,
      deviceType: 'Speaker' as AudioDeviceType
    };
    const client = createStatefulCallClientWithDeviceManager(createMockDeviceManagerWithSpeakers([speaker]));

    expect(client.getState().deviceManager.selectedSpeaker).not.toBeDefined();

    await (await client.getDeviceManager()).selectSpeaker(speaker);
    expect(client.getState().deviceManager.selectedSpeaker).toBeDefined();
    expect(client.getState().deviceManager.selectedSpeaker?.name).toBe('speaker');
  });

  test('should proxy askDevicePermission and update deviceAccess in state', async () => {
    const { declarativeDeviceManager, callContext } = createDeclarativeDeviceManager();
    const deviceAccess = await declarativeDeviceManager.askDevicePermission({ audio: false, video: false });
    expect(deviceAccess.audio).toBe(true);
    expect(deviceAccess.video).toBe(true);
    expect(callContext.getState().deviceManager.deviceAccess).toBeDefined();
    expect(callContext.getState().deviceManager.deviceAccess?.audio).toBe(true);
    expect(callContext.getState().deviceManager.deviceAccess?.video).toBe(true);
  });

  test('should detect audioDevicesUpdated update microphones/speakers in state using deviceManager', async () => {
    const { mockDeviceManager, callContext } = createDeclarativeDeviceManager();
    mockDeviceManager.emit('audioDevicesUpdated', {});
    await waitWithBreakCondition(
      () =>
        callContext.getState().deviceManager.microphones.length !== 0 &&
        callContext.getState().deviceManager.speakers.length !== 0
    );
    expect(callContext.getState().deviceManager.speakers.length).toBe(1);
    expect(callContext.getState().deviceManager.speakers[0].name).toBe('speaker');
    expect(callContext.getState().deviceManager.microphones.length).toBe(1);
    expect(callContext.getState().deviceManager.microphones[0].name).toBe('microphone');
  });

  test('should detect selectedMicrophoneChanged update selectedMicrophone in state using deviceManager', async () => {
    const { mockDeviceManager, callContext } = createDeclarativeDeviceManager();
    mockDeviceManager.emit('selectedMicrophoneChanged', {});
    await waitWithBreakCondition(() => callContext.getState().deviceManager.selectedMicrophone !== undefined);
    expect(callContext.getState().deviceManager.selectedMicrophone).toBeDefined();
    expect(callContext.getState().deviceManager.selectedMicrophone?.name).toBe('selected_microphone');
  });

  test('should detect selectedSpeakerChanged update selectedSpeaker in state using deviceManager', async () => {
    const { mockDeviceManager, callContext } = createDeclarativeDeviceManager();
    mockDeviceManager.emit('selectedSpeakerChanged', {});
    await waitWithBreakCondition(() => callContext.getState().deviceManager.selectedSpeaker !== undefined);
    expect(callContext.getState().deviceManager.selectedSpeaker).toBeDefined();
    expect(callContext.getState().deviceManager.selectedSpeaker?.name).toBe('selected_speaker');
  });
});

const createStatefulCallClientWithDeviceManager = (deviceManager: MockDeviceManager): StatefulCallClient => {
  const agent = createMockCallAgent('defaultDisplayName');
  return createStatefulCallClientWithDeps(
    createMockCallClient(agent, deviceManager),
    new CallContext({ kind: 'communicationUser', communicationUserId: 'defaultUserId' }),
    new InternalCallContext()
  );
};

interface MockDeviceManager extends DeviceManager {
  emit(event: any, data?: any);
}

const createMockDeviceManagerWithCameras = (cameras: VideoDeviceInfo[]): MockDeviceManager => {
  return addMockEmitter({
    async getCameras(): Promise<VideoDeviceInfo[]> {
      return [...cameras];
    }
  }) as MockDeviceManager;
};

const createMockDeviceManagerWithMicrophones = (
  microphones: AudioDeviceInfo[],
  selected?: AudioDeviceInfo
): MockDeviceManager => {
  return addMockEmitter({
    selectedMicrophone: selected,

    async getMicrophones(): Promise<AudioDeviceInfo[]> {
      return [...microphones];
    },
    async selectMicrophone(target: AudioDeviceInfo): Promise<void> {
      this.selectedMicrophone = target;
    }
  }) as MockDeviceManager;
};

const createMockDeviceManagerWithSpeakers = (
  speakers: AudioDeviceInfo[],
  selected?: AudioDeviceInfo
): MockDeviceManager => {
  return addMockEmitter({
    selectedSpeaker: selected,

    async getSpeakers(): Promise<AudioDeviceInfo[]> {
      return [...speakers];
    },
    async selectSpeaker(target: AudioDeviceInfo): Promise<void> {
      this.selectedSpeaker = target;
    }
  }) as MockDeviceManager;
};
