// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(image-gallery) */
import { TEST_PARTICIPANTS, buildUrlForChatAppUsingFakeAdapter, test } from './fixture';
/* @conditional-compile-remove(image-gallery) */
import { expect } from '@playwright/test';
/* @conditional-compile-remove(image-gallery) */
import { dataUiId, stableScreenshot } from '../../common/utils';

/* @conditional-compile-remove(image-gallery) */
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
    await expect(await stableScreenshot(page)).toMatchSnapshot(`inline-image-gallery-modal.png`);
  });

  test('ImageGallery Modal should show broken image icon with alt text when url is a broken link', async ({
    page,
    serverUrl
  }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        localParticipant: TEST_PARTICIPANTS[1],
        remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
        localParticipantPosition: 1,
        sendRemoteInlineImageMessage: true,
        inlineImageUrl: 'images/inlineImage-broken.png'
      })
    );

    await page.locator(dataUiId('SomeImageId1')).click();
    await expect(await stableScreenshot(page)).toMatchSnapshot(`inline-image-gallery-modal-broken-link.png`);
  });

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
    await expect(await stableScreenshot(page)).toMatchSnapshot(`inline-image-gallery-modal-dark-mode.png`);
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
    await expect(await stableScreenshot(page)).toMatchSnapshot(`inline-image-gallery-modal-light-mode.png`);
  });
});
