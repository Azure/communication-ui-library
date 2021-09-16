// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from '../common/config';
import { dataUiId, stubMessageTimestamps } from '../common/utils';
import { test } from './fixture';
import { expect, Page } from '@playwright/test';

export const waitForMeetingCompositeToLoad = async (page: Page): Promise<void> => {
  await page.waitForLoadState('load');

  // @TODO
  // We wait 3 sec here to work around flakiness due to timing.
  // It sometimes take a while for the local video / audio streams to load in CI environments.
  // We don't have a good way to know when the composite is fully loaded.
  await page.waitForTimeout(3000);

  // @TODO Add more checks to make sure the composite is fully loaded.
  await page.waitForSelector(`${dataUiId('call-composite-start-call-button')}[data-is-focusable="true"]`);
};

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
    expect(await page.screenshot()).toMatchSnapshot(`meeting-pre-join-screen.png`, { threshold: 0.5 });
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
    expect(await page.screenshot()).toMatchSnapshot(`meeting-basic-gallery-screen.png`, { threshold: 0.5 });

    // @TODO: future tests to test toggling meeting controls
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
    expect(await pages[0].screenshot()).toMatchSnapshot(`meeting-chat-pane-has-messages.png`, { threshold: 0.5 });
  });

  test.only('People pane opens and displays correctly', async ({ pages }) => {
    const page = pages[1];
    await page.click(dataUiId('meeting-composite-people-button'));
    await page.waitForSelector(dataUiId('meeting-composite-people-pane'));
    expect(await page.screenshot()).toMatchSnapshot(`meeting-people-pane-has-participants.png`, { threshold: 0.5 });

    // @TODO: future tests to verify expected people and interacting with participants
  });

  /**
   * @TODO: Further tests:
   *   - Teams lobby screen
   *   - Leave meeting
   *   - Viewport sizes
   */
});
