// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from '../common/constants';
import {
  buildUrl,
  dataUiId,
  loadCallScreenWithParticipantVideos,
  stubMessageTimestamps,
  waitForMeetingCompositeToLoad
} from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';
import { v1 as generateGUID } from 'uuid';

test.describe('Meeting Composite Pre-Join Tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(buildUrl(serverUrl, user));
      await waitForMeetingCompositeToLoad(page);
    }
  });

  test('Pre-join screen loads correctly', async ({ pages }) => {
    const page = pages[0];
    expect(await page.screenshot()).toMatchSnapshot(`meeting-pre-join-screen.png`);
  });
});

test.describe('Meeting Composite Meeting Page Tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(buildUrl(serverUrl, user));
      await waitForMeetingCompositeToLoad(page);
    }

    await loadCallScreenWithParticipantVideos(pages);
  });

  test('Meeting gallery screen loads correctly', async ({ pages }) => {
    const page = pages[0];
    expect(await page.screenshot()).toMatchSnapshot(`meeting-gallery-screen.png`);
  });

  test('Chat messages are displayed correctly', async ({ pages }) => {
    // Open chat pane on page 0 and send a message
    await pages[0].click(dataUiId('meeting-composite-chat-button'));
    await pages[0].waitForSelector(dataUiId('meeting-composite-chat-pane'));
    await pages[0].type(dataUiId(IDS.sendboxTextField), 'Meeting composite is awesome!');
    await pages[0].keyboard.press('Enter');
    // Open chat pane on page 1 and send a response
    await pages[1].bringToFront();
    await pages[1].click(dataUiId('meeting-composite-chat-button'));
    await pages[1].waitForSelector(dataUiId('meeting-composite-chat-pane'));
    await pages[1].type(dataUiId(IDS.sendboxTextField), 'I agree!');
    await pages[1].keyboard.press('Enter');
    await pages[1].waitForSelector(`[data-ui-status="delivered"]`);
    // Test page 0 has both sent message and received message
    await pages[0].bringToFront();
    await pages[0].waitForSelector(`[data-ui-status="seen"]`);
    await pages[1].bringToFront();
    await pages[1].waitForSelector(`[data-ui-status="seen"]`);

    // Ensure typing indicator has disappeared to prevent flakey test
    await pages[0].bringToFront();
    const typingIndicator = await pages[0].$(dataUiId(IDS.typingIndicator));
    typingIndicator && (await typingIndicator.waitForElementState('hidden'));

    await stubMessageTimestamps(pages[0]);
    expect(await pages[0].screenshot()).toMatchSnapshot(`meeting-gallery-screen-with-chat-pane.png`);
  });

  test('People pane opens and displays correctly', async ({ pages }) => {
    const page = pages[1];
    await page.click(dataUiId('meeting-composite-people-button'));
    await page.waitForSelector(dataUiId('meeting-composite-people-pane'));
    expect(await page.screenshot()).toMatchSnapshot(`meeting-gallery-screen-with-people-pane.png`);
  });

  /**
   * @TODO: Further tests:
   *   - Teams lobby screen
   *   - Leave meeting
   */
});
