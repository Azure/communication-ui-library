// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { stableScreenshot, waitForSelector, dataUiId } from '../../common/utils';
import {
  addScreenshareStream,
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';
import type { MockRemoteParticipantState } from '../../../common';
import { exec } from 'node:child_process';

test.describe('Loading Video Spinner tests', async () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    let freeRam = 0;
    while (freeRam < 1000) {
      exec("free -m | awk 'NR==2 {print $4}'", (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
          // log and return if we encounter an error
          console.error('could not execute command: ', err);
          return;
        }
        // log the output received from the command
        console.log(`Free RAM during test ${JSON.stringify(testInfo.title)}: \n`, output);
        freeRam = parseInt(output);
      });
      if (freeRam >= 1000) {
        return;
      }
      console.log(`${freeRam}MB is not enough RAM for test ${JSON.stringify(testInfo.title)}. Waiting 10s...\n`);
      await new Promise((r) => setTimeout(r, 10000));
    }
  });
  test('Video Gallery shows loading spinners in tiles', async ({ page, serverUrl }) => {
    // Create more than 4 users to ensure that some are placed in the horizontal gallery
    const numParticipants = 10;
    const participants: MockRemoteParticipantState[] = Array.from({ length: numParticipants }).map((_, i) => {
      const participant = defaultMockRemoteParticipant(`User ${i}`);
      addVideoStream(participant, false);
      return participant;
    });
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { hideVideoLoadingSpinner: false })).toMatchSnapshot(
      'video-gallery-with-loading-spinners.png'
    );
  });

  test('Video Gallery shows loading spinners in screen share and horizontal gallery', async ({ page, serverUrl }) => {
    const screenSharingParticipant = defaultMockRemoteParticipant('Screen Sharer');
    addScreenshareStream(screenSharingParticipant, false);
    const horizontalGalleryParticipant = defaultMockRemoteParticipant('Horizontal Gallery User');
    addVideoStream(horizontalGalleryParticipant, false);
    const initialState = defaultMockCallAdapterState([screenSharingParticipant, horizontalGalleryParticipant]);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { hideVideoLoadingSpinner: false })).toMatchSnapshot(
      'horizontal-gallery-with-loading-spinners.png'
    );
  });
});
