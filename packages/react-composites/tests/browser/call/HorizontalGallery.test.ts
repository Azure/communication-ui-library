// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { expect } from '@playwright/test';
import { buildCallingUrl } from './utils';
import { dataUiId, delay, pageClick, waitForSelector } from '../common/utils';
import { TestRemoteParticipant } from './CallingState';
import { IDS } from '../common/constants';

const defaultTestRemoteParticipants: TestRemoteParticipant[] = [
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

test.describe('HorizontalGallery tests', async () => {
  test('HorizontalGallery should have 1 audio participant', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildCallingUrl(serverUrl, {
        remoteParticipants: defaultTestRemoteParticipants
      })
    );
    await delay(500);
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery.png');
  });

  test('HorizontalGallery should have multiple audio participants spanning multiple pages. Navigation buttons should work.', async ({
    pages,
    serverUrl
  }) => {
    const page = pages[0];
    const testRemoteParticipants = defaultTestRemoteParticipants.concat([
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
    ]);
    await page.goto(
      buildCallingUrl(serverUrl, {
        remoteParticipants: testRemoteParticipants
      })
    );
    await delay(500);
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-page-1.png');
    waitForSelector(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-page-2.png');
    waitForSelector(page, dataUiId(IDS.horizontalGalleryLeftNavButton));
    await pageClick(page, dataUiId(IDS.horizontalGalleryLeftNavButton));
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-page-1.png');
  });
});
