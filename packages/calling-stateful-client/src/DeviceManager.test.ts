// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AudioDeviceInfo,
  AudioDeviceType,
  DeviceAccess,
  DeviceManager,
  PermissionConstraints,
  VideoDeviceInfo,
  VideoDeviceType
} from '@azure/communication-calling';
import { CallContext } from './CallContext';
import {
  Mutable,
  addMockEmitter,
  createMockCallAgent,
  createMockCallClient,
  waitWithBreakCondition,
  StateChangeListener
} from './TestUtils';
import { createStatefulCallClientWithDeps, StatefulCallClient } from './StatefulCallClient';
import { InternalCallContext } from './InternalCallContext';
import { CallError } from './CallClientState';

jest.mock('@azure/communication-calling');

describe('device manager', () => {
  test('should proxy getCameras and update cameras in state', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      createMockDeviceManagerWithCameras([cameraWithName('camera')])
    );

    const cameras = await (await client.getDeviceManager()).getCameras();
    expect(cameras.length).toBe(1);
    expect(cameras[0]?.name).toBe('camera');

    expect(client.getState().deviceManager.cameras.length).toBe(1);
    expect(client.getState().deviceManager.cameras[0]?.name).toBe('camera');
  });

  test('should detect videoDevicesUpdated and update cameras in state using deviceManager', async () => {
    const manager = createMockDeviceManagerWithCameras([cameraWithName('camera')]);
    const client = createStatefulCallClientWithDeviceManager(manager);
    // FIXME? Device manager is only created on request, so state is not updated unless device manager is created.
    await client.getDeviceManager();

    manager.emit('videoDevicesUpdated', {});
    expect(await waitWithBreakCondition(() => client.getState().deviceManager.cameras.length === 1)).toBe(true);
    expect(client.getState().deviceManager.cameras[0]?.name).toBe('camera');
  });

  test('should proxy getMicrophones and update microphones in state', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      createMockDeviceManagerWithMicrophones([microphoneWithName('microphone')])
    );

    const microphones = await (await client.getDeviceManager()).getMicrophones();
    expect(microphones.length).toBe(1);
    expect(microphones[0]?.name).toBe('microphone');

    expect(client.getState().deviceManager.microphones.length).toBe(1);
    expect(client.getState().deviceManager.microphones[0]?.name).toBe('microphone');
  });

  test('should proxy selectMicrophone and update selectedMicrophone in state', async () => {
    const microphone = microphoneWithName('microphone');
    const client = createStatefulCallClientWithDeviceManager(createMockDeviceManagerWithMicrophones([microphone]));

    expect(client.getState().deviceManager.selectedMicrophone).not.toBeDefined();

    await (await client.getDeviceManager()).selectMicrophone(microphone);
    expect(client.getState().deviceManager.selectedMicrophone).toBeDefined();
    expect(client.getState().deviceManager.selectedMicrophone?.name).toBe('microphone');
  });

  test('should detect selectedMicrophoneChanged update selectedMicrophone in state using deviceManager', async () => {
    const manager = createMockDeviceManagerWithMicrophones([microphoneWithName('firstMicrophone')]);
    const client = createStatefulCallClientWithDeviceManager(manager);
    // FIXME? Device manager is only created on request, so state is not updated unless device manager is created.
    await client.getDeviceManager();

    expect(client.getState().deviceManager.selectedMicrophone).not.toBeDefined();
    manager.selectedMicrophone = microphoneWithName('firstMicrophone');
    manager.emit('selectedMicrophoneChanged', {});
    expect(
      await waitWithBreakCondition(() => client.getState().deviceManager.selectedMicrophone?.name === 'firstMicrophone')
    ).toBe(true);
  });

  test('should proxy getSpeakers and update speakers in state', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      createMockDeviceManagerWithSpeakers([speakerWithName('speaker')])
    );

    const speakers = await (await client.getDeviceManager()).getSpeakers();
    expect(speakers.length).toBe(1);
    expect(speakers[0]?.name).toBe('speaker');

    expect(client.getState().deviceManager.speakers.length).toBe(1);
    expect(client.getState().deviceManager.speakers[0]?.name).toBe('speaker');
  });

  test('should proxy selectSpeaker and update selectedSpeaker in state', async () => {
    const speaker = speakerWithName('speaker');
    const client = createStatefulCallClientWithDeviceManager(createMockDeviceManagerWithSpeakers([speaker]));

    expect(client.getState().deviceManager.selectedSpeaker).not.toBeDefined();

    await (await client.getDeviceManager()).selectSpeaker(speaker);
    expect(client.getState().deviceManager.selectedSpeaker).toBeDefined();
    expect(client.getState().deviceManager.selectedSpeaker?.name).toBe('speaker');
  });

  test('should detect selectedSpeakerChanged update selectedSpeaker in state using deviceManager', async () => {
    const manager = createMockDeviceManagerWithSpeakers([speakerWithName('speaker')]);
    const client = createStatefulCallClientWithDeviceManager(manager);
    // FIXME? Device manager is only created on request, so state is not updated unless device manager is created.
    await client.getDeviceManager();

    expect(client.getState().deviceManager.selectedSpeaker).not.toBeDefined();
    manager.selectedSpeaker = speakerWithName('speaker');
    manager.emit('selectedSpeakerChanged', {});
    expect(
      await waitWithBreakCondition(() => client.getState().deviceManager.selectedSpeaker?.name === 'speaker')
    ).toBe(true);
  });

  test('should detect audioDevicesUpdated update microphones/speakers in state using deviceManager', async () => {
    const manager = createMockDeviceManagerWithSpeakers(
      [speakerWithName('secondSpeaker')],
      createMockDeviceManagerWithMicrophones([microphoneWithName('firstMicrophone')])
    );
    const client = createStatefulCallClientWithDeviceManager(manager);
    // FIXME? Device manager is only created on request, so state is not updated unless device manager is created.
    await client.getDeviceManager();

    manager.emit('audioDevicesUpdated', {});
    expect(
      await waitWithBreakCondition(() => client.getState().deviceManager.microphones[0]?.name === 'firstMicrophone')
    ).toBe(true);
    expect(
      await waitWithBreakCondition(() => client.getState().deviceManager.speakers[0]?.name === 'secondSpeaker')
    ).toBe(true);
  });

  test('should proxy askDevicePermission and update deviceAccess in state', async () => {
    const manager = addMockEmitter({
      async askDevicePermission(): Promise<DeviceAccess> {
        return {
          audio: true,
          video: true
        };
      }
    }) as MockDeviceManager;
    const client = createStatefulCallClientWithDeviceManager(manager);

    const deviceAccess = await (await client.getDeviceManager()).askDevicePermission({ audio: false, video: false });
    expect(deviceAccess.audio).toBe(true);
    expect(deviceAccess.video).toBe(true);
    expect(client.getState().deviceManager.deviceAccess).toBeDefined();
    expect(client.getState().deviceManager.deviceAccess?.audio).toBe(true);
    expect(client.getState().deviceManager.deviceAccess?.video).toBe(true);
  });
});

describe('errors should be reported correctly from DeviceManger when', () => {
  test('askDevicePermission fails', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      addMockEmitter({
        async askDevicePermission(): Promise<DeviceAccess> {
          throw new Error('injected error');
        }
      }) as MockDeviceManager
    );

    const manager = await client.getDeviceManager();

    const listener = new StateChangeListener(client);
    await expect(manager.askDevicePermission({} as PermissionConstraints)).rejects.toThrowError(
      new CallError('DeviceManager.askDevicePermission', new Error('injected error'))
    );
    expect(listener.onChangeCalledCount).toBe(1);
    expect(client.getState().latestErrors['DeviceManager.askDevicePermission']).toBeDefined();
  });

  test('camera related methods fail', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      addMockEmitter({
        async getCameras(): Promise<VideoDeviceInfo[]> {
          throw new Error('injected error');
        }
      }) as MockDeviceManager
    );

    const manager = await client.getDeviceManager();

    const listener = new StateChangeListener(client);
    await expect(manager.getCameras()).rejects.toThrowError(
      new CallError('DeviceManager.getCameras', new Error('injected error'))
    );
    expect(listener.onChangeCalledCount).toBe(1);
    expect(client.getState().latestErrors['DeviceManager.getCameras']).toBeDefined();
  });

  test('microphone related methods fail', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      addMockEmitter({
        async getMicrophones(): Promise<AudioDeviceInfo[]> {
          throw new Error('get: injected error');
        },
        async selectMicrophone(): Promise<void> {
          throw new Error('select: injected error');
        }
      }) as MockDeviceManager
    );

    const manager = await client.getDeviceManager();
    {
      const listener = new StateChangeListener(client);
      await expect(manager.getMicrophones()).rejects.toThrowError(
        new CallError('DeviceManager.getMicrophones', new Error('get: injected error'))
      );
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['DeviceManager.getMicrophones']).toBeDefined();
    }
    {
      const listener = new StateChangeListener(client);
      await expect(manager.selectMicrophone(microphoneWithName('classic'))).rejects.toThrowError(
        new CallError('DeviceManager.selectMicrophone', new Error('select: injected error'))
      );
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['DeviceManager.selectMicrophone']).toBeDefined();
    }
  });

  test('speaker related methods fail', async () => {
    const client = createStatefulCallClientWithDeviceManager(
      addMockEmitter({
        async getSpeakers(): Promise<AudioDeviceInfo[]> {
          throw new Error('get: injected error');
        },
        async selectSpeaker(): Promise<void> {
          throw new Error('select: injected error');
        }
      }) as MockDeviceManager
    );

    const manager = await client.getDeviceManager();
    {
      const listener = new StateChangeListener(client);
      await expect(manager.getSpeakers()).rejects.toThrowError(
        new CallError('DeviceManager.getSpeakers', new Error('get: injected error'))
      );
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['DeviceManager.getSpeakers']).toBeDefined();
    }
    {
      const listener = new StateChangeListener(client);
      await expect(manager.selectSpeaker(speakerWithName('classic'))).rejects.toThrowError(
        new CallError('DeviceManager.selectSpeaker', new Error('select: injected error'))
      );
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['DeviceManager.selectSpeaker']).toBeDefined();
    }
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

interface MockDeviceManager extends Mutable<DeviceManager> {
  emit(eventName: string | symbol, ...args: any[]): boolean;
}

const createMockDeviceManagerWithCameras = (cameras: VideoDeviceInfo[]): MockDeviceManager => {
  return addMockEmitter({
    async getCameras(): Promise<VideoDeviceInfo[]> {
      return [...cameras];
    }
  }) as MockDeviceManager;
};

const createMockDeviceManagerWithMicrophones = (microphones: AudioDeviceInfo[]): MockDeviceManager => {
  return addMockEmitter({
    selectedMicrophone: undefined,

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
  base?: MockDeviceManager
): MockDeviceManager => {
  const mixin = addMockEmitter({
    selectedSpeaker: undefined,

    async getSpeakers(): Promise<AudioDeviceInfo[]> {
      return [...speakers];
    },
    async selectSpeaker(target: AudioDeviceInfo): Promise<void> {
      this.selectedSpeaker = target;
    }
  });
  return { ...base, ...mixin, isSpeakerSelectionAvailable: true } as MockDeviceManager;
};

const cameraWithName = (name: string): VideoDeviceInfo => ({
  name,
  id: '3',
  deviceType: 'UsbCamera' as VideoDeviceType
});

const microphoneWithName = (name: string): AudioDeviceInfo => ({
  name,
  id: '4',
  isSystemDefault: false,
  deviceType: 'Microphone' as AudioDeviceType
});

const speakerWithName = (name: string): AudioDeviceInfo => ({
  name,
  id: '5',
  isSystemDefault: false,
  deviceType: 'Speaker' as AudioDeviceType
});
