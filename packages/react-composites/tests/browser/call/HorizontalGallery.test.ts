// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { expect } from '@playwright/test';
import { v1 as generateGUID } from 'uuid';
import { buildCallingUrl } from './utils';
import { delay } from '../common/utils';

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
          remoteParticipants: [
            {
              displayName: 'Paul Bridges',
              isMuted: false,
              isSpeaking: true,
              isVideoStreamAvailable: true
            },
            {
              displayName: 'Eryka Klein',
              isMuted: false,
              isSpeaking: false,
              isVideoStreamAvailable: false
            },
            {
              displayName: 'Fiona Harper',
              isMuted: false,
              isSpeaking: false,
              isVideoStreamAvailable: true
            }
          ]
        },
        { useFrLocale: 'true' }
      )
    );
  });

  test('HorizontalGallery should have 2 audio participants', async ({ pages }) => {
    const page = pages[0];
    await delay(500);
    expect(await page.screenshot()).toMatchSnapshot('horizontal-gallery-page.png');
  });
});
