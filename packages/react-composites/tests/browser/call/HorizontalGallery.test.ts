// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { expect } from '@playwright/test';
import { v1 as generateGUID } from 'uuid';

test.describe('HorizontalGallery tests', async () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    const user = users[0];
    user.groupId = newTestGuid;

    // Load different locale for locale tests
    const page = pages[0];
    await page.goto(
      buildCallingUrl(
        serverUrl,
        {
          displayName: 'Agnes Thompson',
          isLocalPreviewMicrophoneEnabled: true,
          page: 'call',
          call: {
            id: 'call1',
            callerInfo: { displayName: 'caller', identifier: { kind: 'unknown', id: '1' } },
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
            remoteParticipants: {
              '2': {
                identifier: { kind: 'unknown', id: '2' },
                state: 'Connected',
                videoStreams: {
                  '1': {
                    id: 1,
                    mediaStreamType: 'Video',
                    isAvailable: true
                  }
                },
                isMuted: false,
                isSpeaking: true,
                displayName: 'Paul Bridges'
              },
              '3': {
                identifier: { kind: 'unknown', id: '3' },
                state: 'Connected',
                videoStreams: {},
                isMuted: true,
                isSpeaking: false,
                displayName: 'Eryka Klein'
              }
            },
            remoteParticipantsEnded: {}
          },
          userId: { kind: 'unknown', id: '1' },
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
            microphones: [
              { id: 'microphone1', name: '1st Microphone', deviceType: 'Microphone', isSystemDefault: true }
            ],
            selectedSpeaker: { id: 'speaker1', name: 'First Speaker', deviceType: 'Speaker', isSystemDefault: true },
            speakers: [{ id: 'speaker1', name: 'First Speaker', deviceType: 'Speaker', isSystemDefault: true }],
            unparentedViews: [],
            deviceAccess: { video: true, audio: true }
          },
          isTeamsCall: false,
          latestErrors: {}
        },
        { useFrLocale: 'true' }
      )
    );
  });

  test('HorizontalGallery should have 2 audio participants', async ({ pages }) => {
    const page = pages[0];
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-page.png');
  });
});

const encodeQueryData = (qArgs?: { [key: string]: string }): string => {
  const qs: Array<string> = [];
  for (const key in qArgs) {
    qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(qArgs[key]));
  }
  return qs.join('&');
};

/**
 * Create the test URL.
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param user - Test user the props of which populate query search parameters
 * @param state - State
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 * @returns URL string
 */
const buildCallingUrl = (
  serverUrl: string,
  state: Record<string, unknown>,
  qArgs?: { [key: string]: string }
): string => {
  return `${serverUrl}?${encodeQueryData({ state: JSON.stringify(state), ...qArgs })}`;
};
