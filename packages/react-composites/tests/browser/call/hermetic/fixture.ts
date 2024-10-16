// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Browser, Page, test as base } from '@playwright/test';
import path from 'path';
import { createTestServer } from '../../common/server';
import { loadNewPageWithPermissionsForCalls } from '../../common/fixtureHelpers';
import { encodeQueryData } from '../../common/utils';
import type {
  MockCallAdapterState,
  MockRemoteParticipantState,
  MockVideoStreamRendererViewState
} from '../../../common';
import type { CallKind, DominantSpeakersInfo, ParticipantRole } from '@azure/communication-calling';
import type { ParticipantCapabilities } from '@azure/communication-calling';
import { CallState, CapabilitiesFeatureState } from '@internal/calling-stateful-client';

const SERVER_URL = 'http://localhost';
const APP_DIR = path.join(__dirname, '../../../app/call');

/**
 * Create the test URL.
 *
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param mockCallAdapterState - Initial state for the {@link MockCallAdapter} constructed by the test app.
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 * @returns URL string
 */
export const buildUrlWithMockAdapter = (
  serverUrl: string,
  mockCallAdapterState?: MockCallAdapterState,
  qArgs?: { [key: string]: string }
): string => {
  return `${serverUrl}?${encodeQueryData({
    mockCallAdapterState: JSON.stringify(mockCallAdapterState),
    ...qArgs
  })}`;
};

export interface TestFixture {
  serverUrl: string;
  page: Page;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePage = async ({ browser }: { browser: Browser }, use: (page: Page) => Promise<void>) => {
  await use(await loadNewPageWithPermissionsForCalls(browser));
};

/**
 * Create the default {@link MockCallAdapterState}for hermetic e2e tests.
 */
export function defaultMockCallAdapterState(
  participants?: MockRemoteParticipantState[],
  role?: ParticipantRole,
  isRoomsCall?: boolean,
  callEndReasonSubCode?: number,
  isReactionCapability?: boolean
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
    page: callEndReasonSubCode ? 'leftCall' : 'call',
    call: {
      id: 'call1',

      kind: 'Call' as CallKind,
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
      isMuted: role === 'Consumer', // default is false unless the role is Consumer
      isScreenSharingOn: false,
      remoteParticipants,
      remoteParticipantsEnded: {},
      raiseHand: { raisedHands: [] },
      /* @conditional-compile-remove(together-mode) */
      togetherMode: { stream: [] },
      pptLive: { isActive: false },
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
        startCaptionsInProgress: false,

        captionsKind: 'Captions'
      },
      transfer: {
        acceptedTransfers: {}
      },
      optimalVideoCount: {
        maxRemoteVideoStreams: 4
      },

      capabilitiesFeature: getCapabilitiesFromRole(role, isReactionCapability)
    },
    endedCall: callEndReasonSubCode
      ? {
          ...defaultEndedCallState,
          callEndReason: {
            code: 0,
            subCode: callEndReasonSubCode,
            /* @conditional-compile-remove(calling-beta-sdk) */ resultCategories: [],
            /* @conditional-compile-remove(calling-beta-sdk) */ message: ''
          }
        }
      : undefined,
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
    isRoomsCall: isRoomsCall ?? false,
    latestErrors: {},
    /* @conditional-compile-remove(breakout-rooms) */
    latestNotifications: {},
    targetCallees: undefined,
    reactions: undefined
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
 * Create the default {@link MockRemoteParticipantState} for a PSTN participant in a hermetic e2e test
 *
 * use to add PSTN participants to the {@link defaultCallAdapterState}
 */
export function defaultMockRemotePSTNParticipant(phoneNumber: string): MockRemoteParticipantState {
  return {
    identifier: { kind: 'phoneNumber', phoneNumber: `${phoneNumber}` },
    state: 'Connected',
    videoStreams: {},
    isMuted: true,
    isSpeaking: false,
    displayName: phoneNumber
  };
}

/**
 * Add the default {@link MockLocalVideoStreamState} for hermetic e2e tests.
 *
 * Use this to add outgoing video to state created via {@link defaultCallAdapterState}.
 */
export function addDefaultMockLocalVideoStreamState(state: MockCallAdapterState): void {
  if (!state.call) {
    throw new Error('state.call must be defined');
  }
  state.call.localVideoStreams = [
    {
      source: {
        deviceType: 'UsbCamera',
        id: 'FakeLocalCamera',
        name: 'FakeLocalCamera'
      },
      mediaStreamType: 'Video',
      dummyView: { scalingMode: 'Crop', isMirrored: false }
    }
  ];
}

/**
 * Add a video stream to {@link MockRemoteParticipantState}.
 *
 * Use to add video to participant created via {@link defaultMockRemoteParticipant}.
 */
export function addVideoStream(
  participant: MockRemoteParticipantState,
  isReceiving: boolean,
  scalingMode?: 'Stretch' | 'Crop' | 'Fit'
): void {
  const streams = Object.values(participant.videoStreams).filter((s) => s.mediaStreamType === 'Video');
  if (streams.length !== 1 || !streams[0]) {
    throw new Error(`Expected 1 video stream for ${participant.displayName}, got ${streams.length}`);
  }
  addDummyView(streams[0], isReceiving, scalingMode);
}

/**
 * Add a screenshare stream to {@link MockRemoteParticipantState}.
 *
 * Use to add video to participant created via {@link defaultMockRemoteParticipant}.
 */
export function addScreenshareStream(
  participant: MockRemoteParticipantState,
  isReceiving: boolean,
  scalingMode?: 'Stretch' | 'Crop' | 'Fit'
): void {
  const streams = Object.values(participant.videoStreams).filter((s) => s.mediaStreamType === 'ScreenSharing');
  if (streams.length !== 1 || !streams[0]) {
    throw new Error(`Expected 1 screenshare stream for ${participant.displayName}, got ${streams.length}`);
  }
  addDummyView(streams[0], isReceiving, scalingMode);
}

/**
 * Add a dummy view to a stream that will be replaced by an actual {@link HTMLElement} by the test app.
 *
 * Supports local / remote streams for video / screenshare.
 */
export function addDummyView(
  stream: { isAvailable?: boolean; isReceiving?: boolean; dummyView?: MockVideoStreamRendererViewState },
  isReceiving: boolean,
  scalingMode?: 'Stretch' | 'Crop' | 'Fit'
): void {
  stream.isAvailable = true;
  stream.isReceiving = isReceiving;
  stream.dummyView = { scalingMode: scalingMode ?? 'Crop', isMirrored: false };
}

/**
 * A test-scoped test fixture for hermetic {@link CallComposite} browser tests.
 *
 * This fixture runs the test app with a mock {@link CallAdapter}, avoiding
 * any communication with the real Azure Communiction Services backend services.
 */
export const test = base.extend<TestFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ appDir: APP_DIR, serverUrl: SERVER_URL }), { scope: 'test' }],

  /** @returns An empty browser page. Tests should load the app via page.goto(). */
  page: [usePage, { scope: 'test' }]
});

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

/**
 * Since we are providing a .y4m video to act as a fake video stream, chrome
 * uses it's file path as the camera name. This file location can differ on
 * every device causing a diff error in test screenshot comparisons.
 * To avoid this error, we replace the unique file path with a custom string.
 */
export const stubLocalCameraName = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const element = document.querySelector('[data-ui-id="call-composite-local-camera-settings"]');
    if (element) {
      element.innerHTML = element.innerHTML.replace(/C:.*?y4m/g, 'Fake Camera');
    }
  });
};

const getCapabilitiesFromRole = (
  role?: ParticipantRole,
  isReactionCapability?: boolean
): CapabilitiesFeatureState | undefined => {
  if (isReactionCapability) {
    return {
      capabilities: presenterCapabilitiesInTeamsCall,
      latestCapabilitiesChangeInfo: { oldValue: {}, newValue: {}, reason: 'RoleChanged' }
    };
  }

  switch (role) {
    case 'Attendee':
      return {
        capabilities: attendeeCapabilitiesInRoomsCall,
        latestCapabilitiesChangeInfo: { oldValue: {}, newValue: {}, reason: 'RoleChanged' }
      };
    case 'Consumer':
      return {
        capabilities: consumerCapabilitiesInRoomsCall,
        latestCapabilitiesChangeInfo: { oldValue: {}, newValue: {}, reason: 'RoleChanged' }
      };
    case 'Presenter':
      return {
        capabilities: presenterCapabilitiesInRoomsCall,
        latestCapabilitiesChangeInfo: { oldValue: {}, newValue: {}, reason: 'RoleChanged' }
      };
    default:
      return undefined;
  }
};

const consumerCapabilitiesInRoomsCall: ParticipantCapabilities = {
  addCommunicationUser: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  addPhoneNumber: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  addTeamsUser: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  blurBackground: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  hangUpForEveryOne: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  manageLobby: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  unmuteMic: { isPresent: false, reason: 'RoleRestricted' },
  pstnDialOut: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  raiseHand: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  removeParticipant: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  removeParticipantsSpotlight: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  shareScreen: { isPresent: false, reason: 'RoleRestricted' },
  spotlightParticipant: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  startLiveCallingCaptions: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  turnVideoOn: { isPresent: false, reason: 'RoleRestricted' },
  muteOthers: {
    isPresent: false,
    reason: 'CapabilityNotApplicableForTheCallType'
  },
  useReactions: {
    isPresent: true,
    reason: 'Capable'
  },
  viewAttendeeNames: {
    isPresent: true,
    reason: 'Capable'
  },
  startLiveMeetingCaptions: {
    isPresent: false,
    reason: 'CapabilityNotApplicableForTheCallType'
  },
  setCaptionLanguage: {
    isPresent: false,
    reason: 'CapabilityNotApplicableForTheCallType'
  },
  /* @conditional-compile-remove(calling-beta-sdk) */
  startTogetherMode: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  /* @conditional-compile-remove(breakout-rooms) */
  joinBreakoutRooms: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' }
};

const attendeeCapabilitiesInRoomsCall: ParticipantCapabilities = {
  addCommunicationUser: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  addPhoneNumber: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  addTeamsUser: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  blurBackground: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  hangUpForEveryOne: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  manageLobby: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  unmuteMic: { isPresent: true, reason: 'Capable' },
  pstnDialOut: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  raiseHand: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  removeParticipant: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  removeParticipantsSpotlight: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  shareScreen: { isPresent: false, reason: 'RoleRestricted' },
  spotlightParticipant: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  startLiveCallingCaptions: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  startLiveMeetingCaptions: {
    isPresent: false,
    reason: 'CapabilityNotApplicableForTheCallType'
  },
  turnVideoOn: { isPresent: true, reason: 'Capable' },
  muteOthers: {
    isPresent: false,
    reason: 'CapabilityNotApplicableForTheCallType'
  },
  useReactions: {
    isPresent: true,
    reason: 'Capable'
  },
  viewAttendeeNames: {
    isPresent: true,
    reason: 'Capable'
  },
  setCaptionLanguage: {
    isPresent: false,
    reason: 'CapabilityNotApplicableForTheCallType'
  },
  /* @conditional-compile-remove(calling-beta-sdk) */
  startTogetherMode: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  /* @conditional-compile-remove(breakout-rooms) */
  joinBreakoutRooms: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' }
};

const presenterCapabilitiesInRoomsCall: ParticipantCapabilities = {
  addCommunicationUser: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  addPhoneNumber: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  addTeamsUser: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  blurBackground: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  hangUpForEveryOne: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  manageLobby: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  unmuteMic: { isPresent: true, reason: 'Capable' },
  pstnDialOut: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  raiseHand: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  removeParticipant: { isPresent: true, reason: 'Capable' },
  removeParticipantsSpotlight: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  shareScreen: { isPresent: true, reason: 'Capable' },
  spotlightParticipant: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  startLiveCallingCaptions: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  startLiveMeetingCaptions: {
    isPresent: false,
    reason: 'CapabilityNotApplicableForTheCallType'
  },
  setCaptionLanguage: {
    isPresent: false,
    reason: 'CapabilityNotApplicableForTheCallType'
  },
  turnVideoOn: { isPresent: true, reason: 'Capable' },
  muteOthers: {
    isPresent: true,
    reason: 'Capable'
  },
  useReactions: {
    isPresent: true,
    reason: 'Capable'
  },
  viewAttendeeNames: {
    isPresent: true,
    reason: 'Capable'
  },
  /* @conditional-compile-remove(calling-beta-sdk) */
  startTogetherMode: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  /* @conditional-compile-remove(breakout-rooms) */
  joinBreakoutRooms: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' }
};

const presenterCapabilitiesInTeamsCall: ParticipantCapabilities = {
  addCommunicationUser: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  addPhoneNumber: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  addTeamsUser: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  blurBackground: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  hangUpForEveryOne: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  manageLobby: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  unmuteMic: { isPresent: true, reason: 'Capable' },
  pstnDialOut: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  raiseHand: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  removeParticipant: { isPresent: true, reason: 'Capable' },
  removeParticipantsSpotlight: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  shareScreen: { isPresent: true, reason: 'Capable' },
  spotlightParticipant: { isPresent: false, reason: 'CapabilityNotApplicableForTheCallType' },
  startLiveCallingCaptions: { isPresent: true, reason: 'Capable' },
  startLiveMeetingCaptions: {
    isPresent: true,
    reason: 'Capable'
  },
  setCaptionLanguage: {
    isPresent: true,
    reason: 'Capable'
  },
  turnVideoOn: { isPresent: true, reason: 'Capable' },
  muteOthers: {
    isPresent: true,
    reason: 'Capable'
  },
  useReactions: {
    isPresent: false,
    reason: 'CapabilityNotApplicableForTheCallType'
  },
  viewAttendeeNames: {
    isPresent: true,
    reason: 'Capable'
  },
  /* @conditional-compile-remove(calling-beta-sdk) */
  startTogetherMode: { isPresent: true, reason: 'Capable' },
  /* @conditional-compile-remove(breakout-rooms) */
  joinBreakoutRooms: { isPresent: true, reason: 'Capable' }
};

const defaultEndedCallState: CallState = {
  id: 'call0',

  kind: 'Call' as CallKind,
  callerInfo: { displayName: 'caller', identifier: { kind: 'communicationUser', communicationUserId: '1' } },
  direction: 'Incoming',
  transcription: { isTranscriptionActive: false },
  recording: { isRecordingActive: false },
  /* @conditional-compile-remove(local-recording-notification) */
  localRecording: { isLocalRecordingActive: false },
  startTime: new Date(500000000000),
  endTime: new Date(500000000000),
  diagnostics: { network: { latest: {} }, media: { latest: {} } },
  state: 'Disconnected',
  localVideoStreams: [],
  isMuted: true,
  isScreenSharingOn: false,
  remoteParticipants: {},
  remoteParticipantsEnded: {},
  raiseHand: { raisedHands: [] },
  /* @conditional-compile-remove(together-mode) */
  togetherMode: { stream: [] },
  pptLive: { isActive: false },
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
};
