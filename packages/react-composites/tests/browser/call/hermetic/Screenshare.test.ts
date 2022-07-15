// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('Screenshare tests', async () => {
  test('Local screenshare notification should be displayed in grid area of VideoGallery when local participant is screensharing', async ({
    page,
    serverUrl
  }) => {
    const testRemoteParticipants = [
      {
        displayName: 'Paul Bridges',
        isSpeaking: true,
        isVideoStreamAvailable: true
      },
      {
        displayName: 'Eryka Klein'
      },
      {
        displayName: 'Fiona Harper',
        isVideoStreamAvailable: true
      },
      {
        displayName: 'Pardeep Singh'
      },
      {
        displayName: 'Reina Takizawa',
        isSpeaking: true
      },
      {
        displayName: 'Vasily Podkolzin',
        isMuted: true
      },
      {
        displayName: 'Luciana Rodriguez'
      },
      {
        displayName: 'Antonie van Leeuwenhoek'
      },
      {
        displayName: 'Gerald Ho'
      }
    ];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        isScreenSharing: true,
        remoteParticipants: testRemoteParticipants
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('local-screenshare.png');
  });

  test('Remote screen share stream should be displayed in grid area of VideoGallery.', async ({ page, serverUrl }) => {
    const testRemoteParticipants = [
      {
        displayName: 'Pardeep Singh'
      },
      {
        displayName: 'Reina Takizawa',
        isSpeaking: true
      },
      {
        displayName: 'Vasily Podkolzin',
        isMuted: true
      },
      {
        displayName: 'Luciana Rodriguez'
      },
      {
        displayName: 'Antonie van Leeuwenhoek'
      },
      {
        displayName: 'Gerald Ho'
      },
      {
        displayName: 'Helen Sediq',
        isScreenSharing: true
      },
      {
        displayName: 'Paul Bridges',
        isSpeaking: true,
        isVideoStreamAvailable: true
      },
      {
        displayName: 'Eryka Klein'
      },
      {
        displayName: 'Fiona Harper',
        isVideoStreamAvailable: true
      }
    ];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        remoteParticipants: testRemoteParticipants
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'remote-screenshare-horizontal-gallery-page-1.png'
    );
    await waitForSelector(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('remote-screenshare-horizontal-gallery-page-2.png');
    await waitForSelector(page, dataUiId(IDS.horizontalGalleryLeftNavButton));
    await pageClick(page, dataUiId(IDS.horizontalGalleryLeftNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('remote-screenshare-horizontal-gallery-back-to-page-1.png');
  });
});
