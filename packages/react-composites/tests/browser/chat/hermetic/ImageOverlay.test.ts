// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TEST_PARTICIPANTS, buildUrlForChatAppUsingFakeAdapter, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';

test.describe('ImageOverlay tests', () => {
  test('ImageOverlay loads correctly when an inline image is clicked', async ({ page, serverUrl }) => {
    if (!TEST_PARTICIPANTS[0] || !TEST_PARTICIPANTS[1] || !TEST_PARTICIPANTS[2]) {
      throw new Error('TEST_PARTICIPANTS must be defined');
    }
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        localParticipant: TEST_PARTICIPANTS[1],
        remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
        localParticipantPosition: 1,
        sendRemoteInlineImageMessage: true
      })
    );

    await page.locator(dataUiId('SomeImageId1')).click();
    expect(await stableScreenshot(page)).toMatchSnapshot(`image-overlay-modal.png`);
  });

  test('ImageOverlay should show broken image icon with alt text when url is a broken link', async ({
    page,
    serverUrl
  }) => {
    // Mock the api call before navigating
    await page.route(serverUrl + '/images/inlineImageExample1.png', async (route) => {
      try {
        await route.continue();
      } catch (error) {
        console.error('Failed at continue on route, Error: ', error);
      }
    });

    await page.route(serverUrl + '/images/inlineImageExample1-fullSize.png', async (route) => {
      try {
        await route.fulfill({ status: 404, contentType: 'text/html' });
      } catch (error) {
        console.error('Failed at fulfill route, Error: ', error);
      }
    });

    if (!TEST_PARTICIPANTS[0] || !TEST_PARTICIPANTS[1] || !TEST_PARTICIPANTS[2]) {
      throw new Error('TEST_PARTICIPANTS must be defined');
    }
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        localParticipant: TEST_PARTICIPANTS[1],
        remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
        localParticipantPosition: 1,
        sendRemoteInlineImageMessage: true
      })
    );

    await page.locator(dataUiId('SomeImageId1')).click();
    expect(await stableScreenshot(page)).toMatchSnapshot(`image-overlay-modal-broken-link.png`);
  });

  test('ImageOverlay should show a placeholder box when loading', async ({ page, serverUrl }) => {
    // Mock the api call before navigating
    await page.route(serverUrl + '/images/inlineImageExample1-fullSize.png', async (route) => {
      setTimeout(async () => {
        try {
          await route.continue();
        } catch (error) {
          console.error('Failed at continue on route, Error: ', error);
        }
      }, 3000);
    });

    if (!TEST_PARTICIPANTS[0] || !TEST_PARTICIPANTS[1] || !TEST_PARTICIPANTS[2]) {
      throw new Error('TEST_PARTICIPANTS must be defined');
    }
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        localParticipant: TEST_PARTICIPANTS[1],
        remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
        localParticipantPosition: 1,
        sendRemoteInlineImageMessage: true
      })
    );

    await page.locator(dataUiId('SomeImageId1')).click();

    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      'image-overlay-loading-stage.png'
    );

    await waitForSelector(page, dataUiId('image-overlay-main-image'));
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      'image-overlay-loaded-stage.png'
    );
  });

  test('ImageOverlay loads correctly in dark theme', async ({ page, serverUrl }) => {
    if (!TEST_PARTICIPANTS[0] || !TEST_PARTICIPANTS[1] || !TEST_PARTICIPANTS[2]) {
      throw new Error('TEST_PARTICIPANTS must be defined');
    }
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
    expect(await stableScreenshot(page)).toMatchSnapshot(`image-overlay-modal-dark-mode.png`);
  });

  test('ImageOverlay loads correctly in light theme', async ({ page, serverUrl }) => {
    if (!TEST_PARTICIPANTS[0] || !TEST_PARTICIPANTS[1] || !TEST_PARTICIPANTS[2]) {
      throw new Error('TEST_PARTICIPANTS must be defined');
    }
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
    expect(await stableScreenshot(page)).toMatchSnapshot(`image-overlay-modal-light-mode.png`);
  });
});
