// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { expect } from '@playwright/test';
import { buildUrlWithMockAdapter } from './utils';
import { dataUiId, pageClick, clickOffPage, waitForPageFontsLoaded, waitForSelector } from '../common/utils';
import { IDS } from '../common/constants';

test.describe('HorizontalGallery tests', async () => {
  test('HorizontalGallery should have 1 audio participant', async ({ pages, serverUrl }) => {
    const page = pages[0];
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
      }
    ];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        remoteParticipants: testRemoteParticipants
      })
    );
    // Click off page to turn away initial aria label
    await clickOffPage(page);
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-1-audio-participant.png');
  });

  test('HorizontalGallery should have multiple audio participants spanning multiple pages. Navigation buttons should work.', async ({
    pages,
    serverUrl
  }) => {
    const page = pages[0];
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
        remoteParticipants: testRemoteParticipants
      })
    );
    // Click off page to turn away initial aria label
    await clickOffPage(page);
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-multiple-audio-participants-page-1.png');
    await waitForSelector(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-multiple-audio-participants-page-2.png');
    await waitForSelector(page, dataUiId(IDS.horizontalGalleryLeftNavButton));
    await pageClick(page, dataUiId(IDS.horizontalGalleryLeftNavButton));
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-multiple-audio-participants-page-1.png');
  });
});
