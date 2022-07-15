// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { stableScreenshot, waitForSelector, dataUiId } from '../../common/utils';
import { test } from '../fixture';
import { TestRemoteParticipant } from '../TestCallingState';
import { buildUrlWithMockAdapter } from '../utils';

test.describe('Loading Video Spinner tests', async () => {
  test('Video Gallery shows loading spinners in tiles', async ({ pages, serverUrl }) => {
    const page = pages[0];
    // Create more than 4 users to ensure that some are placed in the horizontal gallery
    const numParticipants = 10;
    const testRemoteParticipants: TestRemoteParticipant[] = Array.from({ length: numParticipants }).map((_, i) => ({
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

  test('Video Gallery shows loading spinners in screen share and horizontal gallery', async ({ pages, serverUrl }) => {
    const page = pages[0];
    const testRemoteParticipantScreenSharing: TestRemoteParticipant = {
      displayName: 'Screen Sharer',
      isVideoStreamAvailable: false,
      isScreenSharing: true,
      isVideoStreamReceiving: false
    };
    const testRemoteParticipantInHorizontalGallery: TestRemoteParticipant = {
      displayName: 'Horizontal Gallery User',
      isVideoStreamAvailable: true,
      isScreenSharing: true,
      isVideoStreamReceiving: false
    };
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        remoteParticipants: [testRemoteParticipantScreenSharing, testRemoteParticipantInHorizontalGallery]
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true, hideVideoLoadingSpinner: false })).toMatchSnapshot(
      'horizontal-gallery-with-loading-spinners.png'
    );
  });
});
