// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AudioDeviceInfo,
  Call,
  DtmfTone,
  ParticipantRole,
  PermissionConstraints,
  VideoDeviceInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { CallKind } from '@azure/communication-calling';
import { EnvironmentInfo } from '@azure/communication-calling';
import { EventEmitter } from 'events';
import type { CallAdapter, CallAdapterState } from './adapter';
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';

/**
 * Temporary copy of the packages/react-composites/tests/browser/call/app/mocks/MockCallAdapter.ts
 * @internal
 */
// TODO: Remove this simplified copy of the MockCallAdapter when the original MockCallAdapter is moved to fake-backends package and can be imported
export class _MockCallAdapter implements CallAdapter {
  constructor(testState: {
    askDevicePermission?: (constrain: PermissionConstraints) => Promise<void>;
    localParticipantRole?: ParticipantRole;
  }) {
    this.state = {
      ...createDefaultCallAdapterState(testState.localParticipantRole)
    };

    if (testState.askDevicePermission) {
      this.askDevicePermission = testState.askDevicePermission;
    }
  }

  state: CallAdapterState;

  private emitter = new EventEmitter();

  setState(state: CallAdapterState): void {
    this.state = state;
    this.emitter.emit('stateChanged', state);
  }

  addParticipant(): Promise<void> {
    throw Error('addParticipant not implemented');
  }
  onStateChange(handler: (state: CallAdapterState) => void): void {
    this.emitter.addListener('stateChanged', handler);
  }
  offStateChange(handler: (state: CallAdapterState) => void): void {
    this.emitter.removeListener('stateChanged', handler);
  }
  allowUnsupportedBrowserVersion(): void {
    throw Error('allowWithUnsupportedBrowserVersion not implemented');
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
  raiseHand(): Promise<void> {
    throw Error('raiseHand not implemented');
  }
  lowerHand(): Promise<void> {
    throw Error('lowerHand not implemented');
  }
  onReactionClick(emoji: string): Promise<void> {
    throw Error(`Reaction of type ${emoji} send not successful`);
  }
  removeParticipant(): Promise<void> {
    throw Error('removeParticipant not implemented');
  }
  createStreamView(): Promise<void> {
    throw Error('createStreamView not implemented');
  }
  startTogetherMode(): Promise<void> {
    throw Error('startTogetherMode not implemented');
  }
  disposeStreamView(): Promise<void> {
    return Promise.resolve();
  }
  disposeScreenShareStreamView(): Promise<void> {
    return Promise.resolve();
  }
  disposeLocalVideoStreamView(): Promise<void> {
    return Promise.resolve();
  }
  disposeRemoteVideoStreamView(): Promise<void> {
    return Promise.resolve();
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendDtmfTone(dtmfTone: DtmfTone): Promise<void> {
    throw Error('sendDtmfTone not implemented');
  }
  on(): void {
    return;
  }
  off(): void {
    return;
  }
  getEnvironmentInfo(): Promise<EnvironmentInfo> {
    throw Error('getEnvironmentInfo not implemented');
  }

  startCaptions(): Promise<void> {
    throw Error('start captions not implemented');
  }

  setCaptionLanguage(): Promise<void> {
    throw Error('setCaptionLanguage not implemented');
  }

  setSpokenLanguage(): Promise<void> {
    throw Error('setSpokenLanguage not implemented');
  }

  stopCaptions(): Promise<void> {
    throw Error('stopCaptions not implemented');
  }

  startVideoBackgroundEffect(): Promise<void> {
    throw new Error('startVideoBackgroundEffect not implemented.');
  }

  stopVideoBackgroundEffects(): Promise<void> {
    throw new Error('stopVideoBackgroundEffects not implemented.');
  }

  updateBackgroundPickerImages(): void {
    throw new Error('updateBackgroundPickerImages not implemented.');
  }

  public updateSelectedVideoBackgroundEffect(): void {
    throw new Error('updateSelectedVideoBackgroundEffect not implemented.');
  }

  startNoiseSuppressionEffect(): Promise<void> {
    throw new Error('startNoiseSuppressionEffect not implemented.');
  }

  stopNoiseSuppressionEffect(): Promise<void> {
    throw new Error('stopNoiseSuppressionEffect not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submitSurvey(survey: CallSurvey): Promise<CallSurveyResponse | undefined> {
    throw Error('submitStarSurvey not implemented');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startSpotlight(userIds?: string[]): Promise<void> {
    throw Error('startSpotlight not implemented');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stopSpotlight(userIds?: string[]): Promise<void> {
    throw Error('stopSpotlight not implemented');
  }
  stopAllSpotlight(): Promise<void> {
    throw Error('stopAllSpotlight not implemented');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  muteParticipant(userId: string): Promise<void> {
    throw Error('muteParticipant not implemented');
  }
  /* @conditional-compile-remove(soft-mute) */
  muteAllRemoteParticipants(): Promise<void> {
    throw Error('muteAllRemoteParticipants not implemented');
  }
  /* @conditional-compile-remove(breakout-rooms) */
  returnFromBreakoutRoom(): Promise<void> {
    throw Error('returnFromBreakoutRoom not implemented');
  }
}

/**
 * Default call adapter state that the {@link _MockCallAdapter} class is initialized with an optional role.
 */
const createDefaultCallAdapterState = (role?: ParticipantRole): CallAdapterState => {
  return {
    displayName: 'Agnes Thompson',
    isLocalPreviewMicrophoneEnabled: true,
    page: 'call',
    call: {
      id: 'call1',
      /* @conditional-compile-remove(teams-identity-support) */
      kind: CallKind.Call,
      callerInfo: { displayName: 'caller', identifier: { kind: 'communicationUser', communicationUserId: '1' } },
      direction: 'Incoming',
      transcription: { isTranscriptionActive: false },
      recording: { isRecordingActive: false },
      /* @conditional-compile-remove(local-recording-notification) */
      localRecording: { isLocalRecordingActive: false },
      startTime: new Date(500000000000),
      endTime: new Date(500000000000),
      diagnostics: { network: { latest: {} }, media: { latest: {} } },
      state: 'Connected',
      localVideoStreams: [],
      isMuted: false,
      isScreenSharingOn: false,
      remoteParticipants: {},
      remoteParticipantsEnded: {},
      raiseHand: { raisedHands: [] },
      /* @conditional-compile-remove(together-mode) */
      togetherMode: { stream: [] },
      pptLive: { isActive: false },
      localParticipantReaction: undefined,
      role,
      captionsFeature: {
        captions: [],
        supportedSpokenLanguages: [],
        supportedCaptionLanguages: [],
        currentCaptionLanguage: '',
        currentSpokenLanguage: '',
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: false,

        captionsKind: 'Captions'
      },
      transfer: {
        acceptedTransfers: {}
      },
      optimalVideoCount: {
        maxRemoteVideoStreams: 4
      }
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
    isTeamsMeeting: false,
    isRoomsCall: false,
    latestErrors: {},
    /* @conditional-compile-remove(breakout-rooms) */
    latestNotifications: {}
  };
};
