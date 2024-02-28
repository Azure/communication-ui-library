// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AudioDeviceInfo,
  Call,
  DtmfTone,
  MediaStreamType,
  ParticipantRole,
  PermissionConstraints,
  ScalingMode,
  VideoDeviceInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { CallKind } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { EnvironmentInfo } from '@azure/communication-calling';
import { EventEmitter } from 'events';
import type { CallAdapter, CallAdapterState, StartCallIdentifier } from '../adapter';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';
import { CommunicationIdentifier } from '@azure/communication-common';

/**
 * Temporary copy of the packages/react-composites/tests/browser/call/app/mocks/MockCallAdapter.ts
 * @internal
 */
// TODO: Remove this simplified copy of the MockCallAdapter when the original MockCallAdapter is moved to fake-backends package and can be imported
export class _MockCallingWidgetCallAdapter implements CallAdapter {
  constructor(testState: {
    askDevicePermission?: (constrain: PermissionConstraints) => Promise<void>;
    localParticipantRole?: ParticipantRole;
  }) {
    this.state = {
      ...createDefaultCallAdapterState(/* @conditional-compile-remove(rooms) */ testState.localParticipantRole)
    };

    if (testState.askDevicePermission) {
      this.askDevicePermission = testState.askDevicePermission;
    }
  }

  state: CallAdapterState;

  private emitter = new EventEmitter();

  setTransfer(state: CallAdapterState): void {
    const mockVideoElement = document.createElement('div');
    mockVideoElement.innerHTML = '<span />';
    mockVideoElement.style.width = decodeURIComponent('100%25');
    mockVideoElement.style.height = decodeURIComponent('100%25');
    mockVideoElement.style.backgroundPosition = 'center';

    mockVideoElement.style.background =
      'url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemo1Ym9zaTJqMHh3d2RxYnJxM245c3RwZWJiY3FmbWp4aTcxNnA5dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NmGbJwLl7Y4lG/giphy.gif)';
    mockVideoElement.style.backgroundRepeat = 'no-repeat';
    mockVideoElement.style.backgroundSize = 'cover';

    this.state.page = 'transferring';
    this.setState(state);
    setTimeout(() => {
      this.state.page = 'call';
      if (this.state.call) {
        this.state.call = {
          ...this.state.call,
          remoteParticipants: {
            '2': {
              identifier: { communicationUserId: '8:orgid:mock', kind: 'communicationUser' },
              displayName: 'Agent',
              state: 'Connected',
              isMuted: true,
              isSpeaking: false,
              videoStreams: [
                {
                  mediaStreamType: 'Video' as MediaStreamType,
                  isAvailable: true,
                  isReceiving: true,
                  id: 1,
                  view: {
                    target: mockVideoElement,
                    scalingMode: 'Crop' as ScalingMode,
                    isMirrored: true
                  }
                }
              ]
            }
          }
        };
      }
      this.setState(state);
    }, 5000);
  }

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
    const call = this.state.call;
    if (call) {
      call.state = 'Disconnected';
      this.state.page = 'leftCall';
      this.setState(this.state);
    }
    return Promise.resolve();
  }
  startCamera(): Promise<void> {
    if (this.state.call && this.state.devices.selectedCamera) {
      const mockVideoElement = document.createElement('div');
      mockVideoElement.innerHTML = '<span />';
      mockVideoElement.style.width = decodeURIComponent('100%25');
      mockVideoElement.style.height = decodeURIComponent('100%25');
      mockVideoElement.style.backgroundPosition = 'center';
      mockVideoElement.style.background = 'url(https://media.giphy.com/media/mokQK7oyiR8Sk/giphy.gif)';
      mockVideoElement.style.backgroundRepeat = 'no-repeat';

      const newCallState = {
        ...this.state.call,
        localVideoStreams: [
          {
            mediaStreamType: 'Video' as MediaStreamType,
            source: { ...this.state.devices.selectedCamera },
            view: {
              target: mockVideoElement,
              scalingMode: 'Crop' as ScalingMode,
              isMirrored: true
            }
          }
        ]
      };
      this.setState({ ...this.state, call: newCallState });
    }

    return Promise.resolve();
  }
  stopCamera(): Promise<void> {
    if (this.state.call) {
      const newCallState = { ...this.state.call, localVideoStreams: [] };
      this.setState({ ...this.state, call: newCallState });
    }
    return Promise.resolve();
  }
  mute(): Promise<void> {
    throw Error('mute not implemented');
  }
  unmute(): Promise<void> {
    throw Error('unmute not implemented');
  }
  startCall(participants: string[] | StartCallIdentifier[]): Call | undefined {
    this.state.targetCallees = participants as CommunicationIdentifier[];
    this.state.page = 'lobby';
    if (this.state.call) {
      this.state.call = { ...this.state.call, state: 'Connecting' };
    }
    this.setState(this.state);
    setTimeout(() => {
      this.state.page = 'call';
      if (this.state.call) {
        this.state.call = {
          ...this.state.call,
          state: 'Connected',
          remoteParticipants: {
            '2': {
              identifier: { teamsAppId: '28:orgid:mock', kind: 'microsoftTeamsApp' },
              displayName: 'Unknown User',
              state: 'Connected',
              isMuted: true,
              isSpeaking: false,
              videoStreams: []
            }
          }
        };
      }
      this.setState(this.state);
    }, 5000);
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
  /* @conditional-compile-remove(raise-hand) */
  raiseHand(): Promise<void> {
    throw Error('raiseHand not implemented');
  }
  /* @conditional-compile-remove(raise-hand) */
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
    this.setTransfer(this.state);
    return Promise.resolve();
  }
  on(): void {
    return;
  }
  off(): void {
    return;
  }
  /* @conditional-compile-remove(PSTN-calls) */
  getEnvironmentInfo(): Promise<EnvironmentInfo> {
    throw Error('getEnvironmentInfo not implemented');
  }

  /* @conditional-compile-remove(close-captions) */
  startCaptions(): Promise<void> {
    throw Error('start captions not implemented');
  }

  /* @conditional-compile-remove(close-captions) */
  setCaptionLanguage(): Promise<void> {
    throw Error('setCaptionLanguage not implemented');
  }

  /* @conditional-compile-remove(close-captions) */
  setSpokenLanguage(): Promise<void> {
    throw Error('setSpokenLanguage not implemented');
  }

  /* @conditional-compile-remove(close-captions) */
  stopCaptions(): Promise<void> {
    throw Error('stopCaptions not implemented');
  }
  /* @conditional-compile-remove(video-background-effects) */
  startVideoBackgroundEffect(): Promise<void> {
    throw new Error('startVideoBackgroundEffect not implemented.');
  }

  /* @conditional-compile-remove(video-background-effects) */
  stopVideoBackgroundEffects(): Promise<void> {
    throw new Error('stopVideoBackgroundEffects not implemented.');
  }
  /* @conditional-compile-remove(video-background-effects) */
  updateBackgroundPickerImages(): void {
    throw new Error('updateBackgroundPickerImages not implemented.');
  }
  /* @conditional-compile-remove(video-background-effects) */
  public updateSelectedVideoBackgroundEffect(): void {
    throw new Error('updateSelectedVideoBackgroundEffect not implemented.');
  }
  /* @conditional-compile-remove(end-of-call-survey) */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submitSurvey(survey: CallSurvey): Promise<CallSurveyResponse | undefined> {
    throw Error('submitStarSurvey not implemented');
  }
  /* @conditional-compile-remove(spotlight) */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startSpotlight(userIds?: string[]): Promise<void> {
    throw Error('startSpotlight not implemented');
  }
  /* @conditional-compile-remove(spotlight) */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stopSpotlight(userIds?: string[]): Promise<void> {
    throw Error('stopSpotlight not implemented');
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
      startTime: new Date(),
      endTime: new Date(500000000000),
      diagnostics: { network: { latest: {} }, media: { latest: {} } },
      state: 'Connected',
      localVideoStreams: [],
      isMuted: false,
      isScreenSharingOn: false,
      remoteParticipants: {},
      remoteParticipantsEnded: {},
      /* @conditional-compile-remove(raise-hand) */
      raiseHand: { raisedHands: [] },
      /* @conditional-compile-remove(reaction) */
      localParticipantReaction: undefined,
      /* @conditional-compile-remove(rooms) */
      role,
      /* @conditional-compile-remove(close-captions) */
      captionsFeature: {
        captions: [],
        supportedSpokenLanguages: [],
        supportedCaptionLanguages: [],
        currentCaptionLanguage: '',
        currentSpokenLanguage: '',
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: false
      },
      /* @conditional-compile-remove(call-transfer) */
      transfer: {
        acceptedTransfers: {}
      },
      /* @conditional-compile-remove(optimal-video-count) */
      optimalVideoCount: {
        maxRemoteVideoStreams: 4
      },
      pptLive: {
        isActive: false
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
    /* @conditional-compile-remove(rooms) */
    isRoomsCall: false,
    latestErrors: {}
  };
};
