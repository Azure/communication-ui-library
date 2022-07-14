// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Page, test as base } from '@playwright/test';
import path from 'path';
import { createTestServer } from '../../../server';
import { bindConsoleErrorForwarding } from '../../common/fixtureHelpers';
import { encodeQueryData } from '../../common/utils';
import type { MockCallAdapterState } from '../MockCallAdapterState';
import type { TestCallingState } from '../TestCallingState';

const SERVER_URL = 'http://localhost';
const APP_DIR = path.join(__dirname, '../app');

/**
 * Create the test URL.
 *
 * @deprecated For new tests, use {@link buildUrlWithMockAdapterNext} instead.
 *
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param testCallingState - {@link TestCallingState} to initialize the test app.
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 * @returns URL string
 */
export const buildUrlWithMockAdapter = (
  serverUrl: string,
  testCallingState?: TestCallingState,
  qArgs?: { [key: string]: string }
): string => {
  const state: TestCallingState = testCallingState ?? {};
  return `${serverUrl}?${encodeQueryData({
    mockCallState: JSON.stringify(state),
    ...qArgs
  })}`;
};

/**
 * Create the test URL.
 *
 * TODO: Rename to buildUrlWithMockAdapter once all tests are ported over.
 *
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param mockCallAdapterState - Initial state for the {@link MockCallAdapter} constructed by the test app.
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 * @returns URL string
 */
export const buildUrlWithMockAdapterNext = (
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
  initialState: MockCallAdapterState;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePage = async ({ serverUrl, browser }, use) => {
  const context = await browser.newContext({ permissions: ['notifications', 'camera', 'microphone'] });
  const page = await context.newPage();
  bindConsoleErrorForwarding(page);
  await use(page);
};

function useMockCallAdapterState({}, use) {
  const state: MockCallAdapterState = {
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
  use(state);
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
  page: [usePage, { scope: 'test' }],

  /** @returns A default {@link MockCallAdapterState}. Tests should modify this state as needed. */
  initialState: [useMockCallAdapterState, { scope: 'test' }]
});
