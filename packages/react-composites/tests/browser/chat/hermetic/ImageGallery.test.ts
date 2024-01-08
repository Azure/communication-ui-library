// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TEST_PARTICIPANTS, buildUrlForChatAppUsingFakeAdapter, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, stableScreenshot } from '../../common/utils';

test.describe('ImageGallery Modal tests', () => {
  test('ImageGallery Modal loads correctly when an inline image is clicked', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        localParticipant: TEST_PARTICIPANTS[1],
        remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
        localParticipantPosition: 1,
        sendRemoteInlineImageMessage: true
      })
    );

    await page.locator(dataUiId('SomeImageId1')).click();
    expect(await stableScreenshot(page)).toMatchSnapshot(`inline-image-gallery-modal.png`);
  });

  test.only('ImageGallery Modal should show broken image icon with alt text when url is a broken link', async ({
    page,
    serverUrl
  }) => {
      try {
        await page.goto(buildUrlForChatAppUsingFakeAdapter(serverUrl, {
          localParticipant: TEST_PARTICIPANTS[1],
          remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
          localParticipantPosition: 1,
          sendRemoteInlineImageMessage: true,
          inlineImageUrl: 'images/inlineImage-broken.png'
        }));
      } catch (error) {
        // This is expected to fail because the image url is a broken link, 
        // we want to swallow this error to prevent it from logging to the console
        await page.locator(dataUiId('SomeImageId1')).click();
        expect(await stableScreenshot(page)).toMatchSnapshot(`inline-image-gallery-modal-broken-link.png`);
      }
  }
  );

  test('ImageGallery Modal loads correctly in dark theme', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        localParticipant: TEST_PARTICIPANTS[1],
        remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
        localParticipantPosition: 1,
        sendRemoteInlineImageMessage: true,
        theme: 'dark'
      })
    );
    await page.locator(dataUiId('SomeImageId1')).click();
    expect(await stableScreenshot(page)).toMatchSnapshot(`inline-image-gallery-modal-dark-mode.png`);
  });

  test('ImageGallery Modal loads correctly in light theme', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        localParticipant: TEST_PARTICIPANTS[1],
        remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
        localParticipantPosition: 1,
        sendRemoteInlineImageMessage: true,
        theme: 'light'
      })
    );
    await page.locator(dataUiId('SomeImageId1')).click();
    expect(await stableScreenshot(page)).toMatchSnapshot(`inline-image-gallery-modal-light-mode.png`);
  });
});
