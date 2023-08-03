// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TEST_PARTICIPANTS, buildUrlForChatAppUsingFakeAdapter, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, stableScreenshot } from '../../common/utils';

test.describe.only('ImageGallery Modal tests', () => {
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
    expect(await stableScreenshot(page)).toMatchSnapshot(`inline-image-gallery-modal-broken-link.png`);
  });
});
