// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { sendMessage, waitForMessageDelivered } from '../../common/chatTestHelpers';
import { dataUiId, stableScreenshot, waitForChatCompositeToLoad } from '../../common/utils';
import { TEST_PARTICIPANTS, buildUrlForChatAppUsingFakeAdapter, test } from './fixture';

const TEST_MESSAGE = 'No, sir, this will not do.';

test.describe('Tests related to messaging', async () => {
  test('Local participant should see their message in thread', async ({ page }) => {
    await waitForChatCompositeToLoad(page);
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      'no-messages-in-chat-thread.png'
    );

    await sendMessage(page, TEST_MESSAGE);
    await waitForMessageDelivered(page);
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      'one-message-in-chat-thread.png'
    );
  });

  test('Inline Image should show a placeholder box when loading', async ({ page, serverUrl }) => {
    // Mock the api call before navigating
    await page.route(serverUrl + '/images/inlineImageExample1.png', async (route) => {
      setTimeout(async () => {
        try {
          await route.continue();
        } catch (error) {
          console.error('Failed at continue on route, Error: ', error);
        }
      }, 3000);
    });

    await waitForChatCompositeToLoad(page);

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

    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      `messaging-inline-image-loading-stage.png`
    );

    await page.locator(dataUiId('SomeImageId1')).hover();

    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      'messaging-inline-image-loaded-stage.png'
    );
  });

  test('Inline Image should show a broken image icon when image fetch failed', async ({ page, serverUrl }) => {
    // Mock the api call before navigating
    await page.route(serverUrl + '/images/inlineImageExample1.png', async (route) => {
      await route.fulfill({
        status: 404
      });
    });

    await waitForChatCompositeToLoad(page);

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
    await page.locator(dataUiId('broken-image-icon')).hover();
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      'messaging-inline-image-broken-image.png'
    );
  });
});
