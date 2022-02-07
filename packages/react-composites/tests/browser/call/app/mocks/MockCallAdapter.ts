// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { AudioDeviceInfo, Call, VideoDeviceInfo } from '@azure/communication-calling';
import {
  LocalVideoStreamState,
  RemoteParticipantState,
  VideoStreamRendererViewState
} from '@internal/calling-stateful-client';
import { CallAdapter, CallAdapterState } from '../../../../../src';
import { TestCallingState, TestRemoteParticipant } from '../../TestCallingState';

/**
 * Mock class that implements CallAdapter interface for UI snapshot tests. The handler implementation is currently limited so
 * some composite behaviour will not work like clicking the 'Start Call' button in the Configuration page. The usage of
 * MockCallAdapter is intended to talk snapshot based only on the state of a CallAdapter.
 */
export class MockCallAdapter implements CallAdapter {
  constructor(testState?: TestCallingState) {
    if (!testState) {
      this.state = defaultCallAdapterState;
      return;
    }

    const initialState = defaultCallAdapterState;

    if (initialState.call) {
      if (testState?.remoteParticipants) {
        const remoteParticipants = convertTestParticipantsToCallAdapterStateParticipants(testState.remoteParticipants);
        Object.values(remoteParticipants).forEach((participant) => addMockVideo(participant));
        initialState.call.remoteParticipants = remoteParticipants;
      }
      if (testState.isScreenSharing) {
        initialState.call.isScreenSharingOn = true;
        const screenShareStream: LocalVideoStreamState = createLocalScreenShareStream();
        initialState.call.localVideoStreams = [screenShareStream];
      }
    }
    if (testState.page) {
      initialState.page = testState.page;
    }
    if (testState.latestErrors) {
      initialState.latestErrors = testState.latestErrors;
    }

    this.state = initialState;
  }

  state: CallAdapterState;

  addParticipant(): void {
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
  askDevicePermission(): Promise<void> {
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
 * Helper function to convert array of TestRemoteParticipant to record of RemoteParticipantState
 * @param mockRemoteParticipants - array of TestRemoteParticipant
 * @returns Record of RemoteParticipantState
 */
const convertTestParticipantsToCallAdapterStateParticipants = (
  testRemoteParticipants: TestRemoteParticipant[]
): Record<string, RemoteParticipantState> => {
  const remoteParticipants: Record<string, RemoteParticipantState> = {};

  testRemoteParticipants.forEach((testRemoteParticipant, i) => {
    remoteParticipants[i] = {
      identifier: { kind: 'communicationUser', communicationUserId: `${i}` },
      state: 'Connected',
      videoStreams: {
        1: {
          id: 1,
          mediaStreamType: 'Video',
          isAvailable: !!testRemoteParticipant.isVideoStreamAvailable
        },
        2: {
          id: 2,
          mediaStreamType: 'ScreenSharing',
          isAvailable: !!testRemoteParticipant.isScreenSharing
        }
      },
      isMuted: !!testRemoteParticipant.isMuted,
      isSpeaking: !!testRemoteParticipant.isSpeaking,
      displayName: testRemoteParticipant.displayName
    };
  });

  return remoteParticipants;
};

/**
 * Helper function to add mock video element to RemoteParticipantState
 * @param remoteParticipant - RemoteParticipantState
 * @returns void
 */
const addMockVideo = (remoteParticipant: RemoteParticipantState): void => {
  for (const videoStream of Object.values(remoteParticipant.videoStreams)) {
    if (videoStream.isAvailable) {
      const mockVideoElement = createMockHTMLElement(remoteParticipant.displayName);
      const view: VideoStreamRendererViewState = { scalingMode: 'Crop', isMirrored: false, target: mockVideoElement };
      videoStream.view = view;
    }
  }
};

/**
 * Helper function to create local screen share stream
 * @returns LocalVideoStreamState
 */
const createLocalScreenShareStream = (): LocalVideoStreamState => {
  const screenShareElement = createMockHTMLElement();
  const view: VideoStreamRendererViewState = {
    scalingMode: 'Crop',
    isMirrored: false,
    target: screenShareElement
  };
  const screenShareStream: LocalVideoStreamState = {
    source: { id: 'screenshare1', name: 'Screenshare', deviceType: 'CaptureAdapter' },
    mediaStreamType: 'ScreenSharing',
    view: view
  };
  return screenShareStream;
};

/**
 * Helper function that creates an html element with a colored background with an input string. To ensure a consistent color,
 * the background coloris the hex representation of the participant's display name.
 * @param str - input string
 * @returns
 */
const createMockHTMLElement = (str?: string): HTMLElement => {
  const mockVideoElement = document.createElement('div');
  mockVideoElement.innerHTML = '<span />';
  mockVideoElement.style.width = decodeURIComponent('100%25');
  mockVideoElement.style.height = decodeURIComponent('100%25');
  mockVideoElement.style.background = stringToHexColor(str ?? '');
  mockVideoElement.style.backgroundPosition = 'center';
  mockVideoElement.style.backgroundRepeat = 'no-repeat';
  return mockVideoElement;
};

/**
 * Helper function to randomly choose a background color for mocking a video stream
 * @param str - input string
 * @returns hex color code as a string
 */
const stringToHexColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

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
