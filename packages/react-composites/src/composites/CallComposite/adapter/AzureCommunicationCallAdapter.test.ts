// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { CommunicationUserKind } from '@azure/communication-common';
import { CallState, IncomingCallState, LocalVideoStreamState, StatefulDeviceManager } from 'calling-stateful-client';
import {
  CallAgentOverrides,
  createMockStatefulCallClient,
  DeviceManagerOverrides,
  StatefulOverrides,
  waitWithBreakCondition
} from '../../../mocks';
import { AzureCommunicationCallAdapter } from './AzureCommunicationCallAdapter';

const DISPOSE_ERROR_MESSAGE = 'dispose error';
const GET_CAMERA_ERROR_MESSAGE = 'camera error';
const GET_MICROPHONE_ERROR_MESSAGE = 'microphone error';
const GET_SPEAKER_ERROR_MESSAGE = 'speaker error';
const PERMISSION_ERROR_MESSAGE = 'permission error';
const JOIN_ERROR_MESSAGE = 'join error';
const START_ERROR_MESSAGE = 'start error';

const STATEFUL_OVERRIDES: StatefulOverrides = {
  getState: () => {
    return {
      calls: new Map<string, CallState>(),
      callsEnded: [] as CallState[],
      incomingCalls: new Map<string, IncomingCallState>(),
      incomingCallsEnded: [] as IncomingCallState[],
      deviceManager: {
        isSpeakerSelectionAvailable: false,
        cameras: [] as VideoDeviceInfo[],
        microphones: [] as AudioDeviceInfo[],
        speakers: [] as AudioDeviceInfo[],
        unparentedViews: new Map<LocalVideoStreamState, LocalVideoStreamState>()
      },
      callAgent: undefined,
      userId: { kind: 'communicationUser', communicationUserId: '' } as CommunicationUserKind
    };
  }
};

const DEVICEMANAGER_EXCEPTION_OVERRIDES: DeviceManagerOverrides = {
  getCameras: () => {
    throw new Error(GET_CAMERA_ERROR_MESSAGE);
  },
  getMicrophones: () => {
    throw new Error(GET_MICROPHONE_ERROR_MESSAGE);
  },
  getSpeakers: () => {
    throw new Error(GET_SPEAKER_ERROR_MESSAGE);
  },
  askDevicePermission: () => {
    throw new Error(PERMISSION_ERROR_MESSAGE);
  }
};

const CALLAGENT_EXCEPTION_OVERRIDES: CallAgentOverrides = {
  join: () => {
    throw new Error(JOIN_ERROR_MESSAGE);
  },
  startCall: () => {
    throw new Error(START_ERROR_MESSAGE);
  },
  dispose: () => {
    return Promise.reject(new Error(DISPOSE_ERROR_MESSAGE));
  }
};

describe('AzureCommunicationCallAdapter', () => {
  test('emits error event when error happens', async () => {
    let error: Error | undefined;
    const errorListener = (e: Error): void => {
      error = e;
    };

    const statefulCallClient = createMockStatefulCallClient(
      STATEFUL_OVERRIDES,
      CALLAGENT_EXCEPTION_OVERRIDES,
      DEVICEMANAGER_EXCEPTION_OVERRIDES,
      undefined
    );
    const callAgent = await statefulCallClient.createCallAgent({
      getToken: (): Promise<any> => {
        return Promise.resolve('');
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      dispose: () => {}
    });
    const deviceManager = await statefulCallClient.getDeviceManager();
    const adapter = new AzureCommunicationCallAdapter(
      statefulCallClient,
      { groupId: '' },
      callAgent,
      deviceManager as StatefulDeviceManager
    );

    adapter.on('error', errorListener);

    adapter.dispose();

    await waitWithBreakCondition(() => error !== undefined);

    expect(error?.message).toBe(DISPOSE_ERROR_MESSAGE);
    expect(adapter.getState().error?.message).toBe(DISPOSE_ERROR_MESSAGE);

    await adapter.queryCameras();

    expect(error?.message).toBe(GET_CAMERA_ERROR_MESSAGE);
    expect(adapter.getState().error?.message).toBe(GET_CAMERA_ERROR_MESSAGE);

    await adapter.queryMicrophones();

    expect(error?.message).toBe(GET_MICROPHONE_ERROR_MESSAGE);
    expect(adapter.getState().error?.message).toBe(GET_MICROPHONE_ERROR_MESSAGE);

    await adapter.querySpeakers();

    expect(error?.message).toBe(GET_SPEAKER_ERROR_MESSAGE);
    expect(adapter.getState().error?.message).toBe(GET_SPEAKER_ERROR_MESSAGE);

    await adapter.askDevicePermission({ video: true, audio: true });

    expect(error?.message).toBe(PERMISSION_ERROR_MESSAGE);
    expect(adapter.getState().error?.message).toBe(PERMISSION_ERROR_MESSAGE);

    await adapter.joinCall();

    expect(error?.message).toBe(JOIN_ERROR_MESSAGE);
    expect(adapter.getState().error?.message).toBe(JOIN_ERROR_MESSAGE);

    await adapter.startCall([]);

    expect(error?.message).toBe(START_ERROR_MESSAGE);
    expect(adapter.getState().error?.message).toBe(START_ERROR_MESSAGE);
  });
});
