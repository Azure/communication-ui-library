// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { expect } from '@playwright/test';
import { buildCallingUrl } from './utils';
import { delay } from '../common/utils';
import { TestRemoteParticipant } from './CallingState';

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
  test('HorizontalGallery should have 1 audio participants', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildCallingUrl(serverUrl, {
        remoteParticipants: defaultTestRemoteParticipants
      })
    );
    await delay(500);
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-page.png');
  });

  test('HorizontalGallery should have 5 audio participants and have working navigation buttons', async ({
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
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-paged.png');
  });
});
