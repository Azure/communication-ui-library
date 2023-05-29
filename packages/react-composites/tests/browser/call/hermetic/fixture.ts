// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Page, test as base } from '@playwright/test';
import path from 'path';
import { createTestServer } from '../../common/server';
import { loadNewPageWithPermissionsForCalls } from '../../common/fixtureHelpers';
import { encodeQueryData } from '../../common/utils';
import type {
  MockCallAdapterState,
  MockRemoteParticipantState,
  MockVideoStreamRendererViewState
} from '../../../common';
/* @conditional-compile-remove(teams-identity-support) */
import type { CallKind } from '@azure/communication-calling';

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
const usePage = async ({ browser }, use) => {
  await use(await loadNewPageWithPermissionsForCalls(browser));
};

/**
 * Create the default {@link MockCallAdapterState}for hermetic e2e tests.
 */
export function defaultMockCallAdapterState(participants?: MockRemoteParticipantState[]): MockCallAdapterState {
  const remoteParticipants: Record<string, MockRemoteParticipantState> = {};
  participants?.forEach((p) => {
    remoteParticipants[toFlatCommunicationIdentifier(p.identifier)] = p;
  });
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
      isMuted: false,
      isScreenSharingOn: false,
      remoteParticipants,
      remoteParticipantsEnded: {},
      captionsFeature: {
        captions: [],
        supportedSpokenLanguages: [],
        supportedCaptionLanguages: [],
        currentCaptionLanguage: '',
        currentSpokenLanguage: '',
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: false
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
  if (streams.length !== 1) {
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
  if (streams.length !== 1) {
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
export const defaultMockConfigurationPageState = (): MockCallAdapterState => {
  const state = defaultMockCallAdapterState();
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
