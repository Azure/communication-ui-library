// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from '../common/config';
import { dataUiId, stubMessageTimestamps } from '../common/utils';
import { waitForMeetingCompositeToLoad } from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';

test.describe('Meeting Composite Pre-Join Tests', () => {
  test.beforeEach(async ({ pages }) => {
    for (const page of pages) {
      page.reload();
      page.bringToFront();
      await waitForMeetingCompositeToLoad(page);
    }
  });

  test('Pre-join screen loads correctly', async ({ pages }) => {
    const page = pages[0];
    expect(await page.screenshot()).toMatchSnapshot(`meeting-pre-join-screen.png`);
  });
});

test.describe('Meeting Composite Meeting Page Tests', () => {
  test.beforeEach(async ({ pages }) => {
    for (const page of pages) {
      page.reload();
      page.bringToFront();
      await waitForMeetingCompositeToLoad(page);

      // Join Meeting for each participant
      await page.waitForSelector(dataUiId('call-composite-start-call-button'));
      await page.click(dataUiId('call-composite-start-call-button'));

      // Ensure meeting has successfully loaded
      await page.waitForSelector(dataUiId('call-composite-hangup-button'));
    }
  });

  test('Meeting gallery screen loads correctly', async ({ pages }) => {
    const page = pages[0];
    expect(await page.screenshot()).toMatchSnapshot(`meeting-basic-gallery-screen.png`);
  });

  test('Chat messages are displayed correctly', async ({ pages }) => {
    // Open chat pane on page 0 and send a message
    await pages[0].click(dataUiId('meeting-composite-chat-button'));
    await pages[0].waitForSelector(dataUiId('meeting-composite-chat-pane'));
    await pages[0].type(dataUiId(IDS.sendboxTextfield), 'Meeting composite is awesome!');
    await pages[0].keyboard.press('Enter');

    // Open chat pane on page 1 and send a response
    await pages[1].bringToFront();
    await pages[1].click(dataUiId('meeting-composite-chat-button'));
    await pages[1].waitForSelector(dataUiId('meeting-composite-chat-pane'));
    await pages[1].type(dataUiId(IDS.sendboxTextfield), 'I agree!');
    await pages[1].keyboard.press('Enter');
    await pages[1].waitForSelector(`[data-ui-status="delivered"]`);

    // Test page 0 has both sent message and received message
    await pages[0].bringToFront();
    await pages[0].waitForSelector(`[data-ui-status="seen"]`);
    stubMessageTimestamps(pages[0]);
    expect(await pages[0].screenshot()).toMatchSnapshot(`meeting-chat-pane-has-messages.png`);
  });

  test('People pane opens and displays correctly', async ({ pages }) => {
    const page = pages[1];
    await page.click(dataUiId('meeting-composite-people-button'));
    await page.waitForSelector(dataUiId('meeting-composite-people-pane'));
    expect(await page.screenshot()).toMatchSnapshot(`meeting-people-pane-has-participants.png`);
  });

  /**
   * @TODO: Further tests:
   *   - Teams lobby screen
   *   - Leave meeting
   */
});
