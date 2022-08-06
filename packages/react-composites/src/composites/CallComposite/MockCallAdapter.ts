// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioDeviceInfo, Call, PermissionConstraints, VideoDeviceInfo } from '@azure/communication-calling';
import { CallAdapter, CallAdapterState } from './adapter';

/**
 * Temporary copy of the packages\react-composites\tests\browser\call\app\mocks\MockCallAdapter.ts
 */
// TODO: Remove this simplified copy of the MockCallAdapter when the original MockCallAdapter is moved to fake-backends package
export class MockCallAdapter implements CallAdapter {
  constructor(testState: { askDevicePermission?: (constrain: PermissionConstraints) => Promise<void> }) {
    this.state = defaultCallAdapterState;

    if (testState.askDevicePermission) {
      this.askDevicePermission = testState.askDevicePermission;
    }
  }

  state: CallAdapterState;

  addParticipant(): Promise<void> {
    throw Error('addParticipant not implemented');
  }
  onStateChange(): void {
    return;
  }
  offStateChange(): void {
    return;
  }
  getState(): CallAdapterState {
    return this.state;
  }
  dispose(): void {
    throw Error('dispose not implemented');
  }
  joinCall(): Call | undefined {
    throw Error('joinCall not implemented');
  }
  leaveCall(): Promise<void> {
    throw Error('leaveCall not implemented');
  }
  startCamera(): Promise<void> {
    throw Error('leaveCall not implemented');
  }
  stopCamera(): Promise<void> {
    throw Error('stopCamera not implemented');
  }
  mute(): Promise<void> {
    throw Error('mute not implemented');
  }
  unmute(): Promise<void> {
    throw Error('unmute not implemented');
  }
  startCall(): Call | undefined {
    throw Error('startCall not implemented');
  }
  holdCall(): Promise<void> {
    return Promise.resolve();
  }
  resumeCall(): Promise<void> {
    return Promise.resolve();
  }
  startScreenShare(): Promise<void> {
    throw Error('startScreenShare not implemented');
  }
  stopScreenShare(): Promise<void> {
    throw Error('stopScreenShare not implemented');
  }
  removeParticipant(): Promise<void> {
    throw Error('removeParticipant not implemented');
  }
  createStreamView(): Promise<void> {
    throw Error('createStreamView not implemented');
  }
  disposeStreamView(): Promise<void> {
    throw Error('disposeStreamView not implemented');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  askDevicePermission(constrain: PermissionConstraints): Promise<void> {
    throw Error('askDevicePermission not implemented');
  }
  async queryCameras(): Promise<VideoDeviceInfo[]> {
    return [];
  }
  async queryMicrophones(): Promise<AudioDeviceInfo[]> {
    return [];
  }
  async querySpeakers(): Promise<AudioDeviceInfo[]> {
    return [];
  }
  setCamera(): Promise<void> {
    throw Error('setCamera not implemented');
  }
  setMicrophone(): Promise<void> {
    throw Error('setMicrophone not implemented');
  }
  setSpeaker(): Promise<void> {
    throw Error('setSpeaker not implemented');
  }
  on(): void {
    throw Error('on not implemented');
  }
  off(): void {
    throw Error('off not implemented');
  }
}

/**
 * Default call adapter state that the {@link MockCallAdapter} class is initialized with
 */
const defaultCallAdapterState: CallAdapterState = {
  displayName: 'Agnes Thompson',
  isLocalPreviewMicrophoneEnabled: true,
  page: 'call',
  call: {
    id: 'call1',
    callerInfo: { displayName: 'caller', identifier: { kind: 'communicationUser', communicationUserId: '1' } },
    direction: 'Incoming',
    transcription: { isTranscriptionActive: false },
    recording: { isRecordingActive: false },
    startTime: new Date(500000000000),
    endTime: new Date(500000000000),
    diagnostics: { network: { latest: {} }, media: { latest: {} } },
    state: 'Connected',
    localVideoStreams: [],
    isMuted: false,
    isScreenSharingOn: false,
    remoteParticipants: {},
    remoteParticipantsEnded: {}
  },
  userId: { kind: 'communicationUser', communicationUserId: '1' },
  devices: {
    isSpeakerSelectionAvailable: true,
    selectedCamera: { id: 'camera1', name: '1st Camera', deviceType: 'UsbCamera' },
    cameras: [{ id: 'camera1', name: '1st Camera', deviceType: 'UsbCamera' }],
    selectedMicrophone: {
      id: 'microphone1',
      name: '1st Microphone',
      deviceType: 'Microphone',
      isSystemDefault: true
    },
    microphones: [{ id: 'microphone1', name: '1st Microphone', deviceType: 'Microphone', isSystemDefault: true }],
    selectedSpeaker: { id: 'speaker1', name: '1st Speaker', deviceType: 'Speaker', isSystemDefault: true },
    speakers: [{ id: 'speaker1', name: '1st Speaker', deviceType: 'Speaker', isSystemDefault: true }],
    unparentedViews: [],
    deviceAccess: { video: true, audio: true }
  },
  isTeamsCall: false,
  latestErrors: {}
};
