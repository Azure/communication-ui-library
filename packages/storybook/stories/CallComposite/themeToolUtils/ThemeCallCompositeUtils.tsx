// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantRole, DominantSpeakersInfo, CallKind } from '@azure/communication-calling';
import {
  CallAdapterState,
  CallState,
  LocalVideoStreamState,
  RemoteParticipantState,
  RemoteVideoStreamState,
  VideoStreamRendererViewState,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';

/**
 * A slight modification of {@link CallAdapterState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockCallAdapterState extends Omit<CallAdapterState, 'call'> {
  call?: MockCallState;
}

/**
 * A slight modification of {@link CallState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockCallState
  extends Omit<CallState, 'localVideoStreams' | 'remoteParticipants' | 'remoteParticipantsEnded'> {
  localVideoStreams: MockLocalVideoStreamState[];
  remoteParticipants: {
    [keys: string]: MockRemoteParticipantState;
  };
  remoteParticipantsEnded: {
    [keys: string]: MockRemoteParticipantState;
  };
}

/**
 * A slight modification of {@link LocalVideoStreamState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockLocalVideoStreamState extends LocalVideoStreamState {
  /**
   * Dummy placeholder for `view`.
   * The test application creates a `view` corresponding to the
   * `dummyView` generating an HTMLElement for the target if needed.
   */
  dummyView?: MockVideoStreamRendererViewState;
}

/**
 * A slight modification of {@link RemoteParticipantState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockRemoteParticipantState extends Omit<RemoteParticipantState, 'videoStreams'> {
  videoStreams: {
    [key: number]: MockRemoteVideoStreamState;
  };
}

/**
 * A slight modification of {@link RemoteVideoStreamState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * - HTMLElement views are replaced with placeholders to be populated
 *   by the test app.
 */
export interface MockRemoteVideoStreamState extends RemoteVideoStreamState {
  /**
   * Dummy placeholder for `view`.
   * The test application creates a `view` corresponding to the
   * `dummyView` generating an HTMLElement for the target if needed.
   */
  dummyView?: MockVideoStreamRendererViewState;
}

/**
 * A slight modification of {@link VideoStreamRendererViewState} for initializing the
 * {@link MockCallAdapter} for hermetic e2e tests.
 *
 * This interface does not contain the `target` field. It is populated by the test application with a dummy HTMLElement.
 */
export type MockVideoStreamRendererViewState = Omit<VideoStreamRendererViewState, 'target'>;

/**
 * Create the default {@link MockCallAdapterState}for hermetic e2e tests.
 */
export function defaultMockCallAdapterState(
  participants?: MockRemoteParticipantState[],
  role?: ParticipantRole,
  isRoomsCall?: boolean
): MockCallAdapterState {
  const remoteParticipants: Record<string, MockRemoteParticipantState> = {};
  participants?.forEach((p) => {
    remoteParticipants[toFlatCommunicationIdentifier(p.identifier)] = p;
  });
  const speakers = participants?.filter((p) => p.isSpeaking);
  const dominantSpeakers: DominantSpeakersInfo = {
    speakersList: speakers?.map((s) => s.identifier) ?? [],
    timestamp: new Date()
  };
  return {
    displayName: 'Agnes Thompson',
    isLocalPreviewMicrophoneEnabled: true,
    page: 'call',
    call: {
      id: 'call1',
      /* @conditional-compile-remove(teams-identity-support) */
      kind: 'Call' as CallKind,
      callerInfo: { displayName: 'caller', identifier: { kind: 'communicationUser', communicationUserId: '1' } },
      direction: 'Incoming',
      transcription: { isTranscriptionActive: false },
      recording: { isRecordingActive: false },
      startTime: new Date(500000000000),
      endTime: new Date(500000000000),
      diagnostics: { network: { latest: {} }, media: { latest: {} } },
      state: 'Connected',
      localVideoStreams: [],
      isMuted: true, // default is false unless the role is Consumer
      isScreenSharingOn: false,
      remoteParticipants,
      remoteParticipantsEnded: {},
      /** @conditional-compile-remove(raise-hand) */
      raiseHand: { raisedHands: [] },
      role: role ?? 'Unknown',
      dominantSpeakers: dominantSpeakers,
      totalParticipantCount:
        Object.values(remoteParticipants).length > 0 ? Object.values(remoteParticipants).length + 1 : undefined,
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
    isRoomsCall: isRoomsCall ?? false,
    latestErrors: {}
  };
}

/**
 * Create the default {@link MockRemoteParticipantState} for hermetic e2e tests.
 *
 * Use this to add participants to state created via {@link defaultCallAdapterState}.
 */
export function defaultMockRemoteParticipant(displayName?: string): MockRemoteParticipantState {
  return {
    identifier: { kind: 'communicationUser', communicationUserId: `8:acs:${displayName}-id` },
    state: 'Connected',
    videoStreams: {
      1: {
        id: 1,
        mediaStreamType: 'Video',
        isAvailable: false,
        isReceiving: false
      },
      2: {
        id: 2,
        mediaStreamType: 'ScreenSharing',
        isAvailable: false,
        isReceiving: false
      }
    },
    isMuted: false,
    isSpeaking: false,
    displayName: displayName
  };
}

/**
 * Sets up the default state for the configuration screen.
 */
export const defaultMockConfigurationPageState = (role?: ParticipantRole): MockCallAdapterState => {
  let isRoomsCall = false;
  if (role && role !== 'Unknown') {
    isRoomsCall = true;
  }
  const state = defaultMockCallAdapterState([], role, isRoomsCall);
  state.page = 'configuration';
  state.call = undefined;
  return state;
};
