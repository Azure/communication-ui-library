// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../browser/common/constants';
import { stableScreenshot, waitForSelector, dataUiId } from '../common/utils';
import { test } from './fixture';
import { buildUrlWithMockAdapter } from './utils';

test.describe('Loading Video Spinner tests', async () => {
  test('Video Gallery shows loading spinners in tiles', async ({ pages, serverUrl }) => {
    const page = pages[0];
    // Create more than 4 users to ensure that some are placed in the horizontal gallery
    const numParticipants = 10;
    const testRemoteParticipants = new Array(numParticipants).map((_, i) => ({
      displayName: `User ${i}`,
      isVideoStreamAvailable: true,
      isVideoStreamReceiving: false
    }));
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        remoteParticipants: testRemoteParticipants
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true, hideVideoLoadingSpinner: false })).toMatchSnapshot(
      'video-gallery-with-loading-spinners.png'
    );
  });
});
