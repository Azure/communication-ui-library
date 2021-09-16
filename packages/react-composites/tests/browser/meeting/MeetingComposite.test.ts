// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { dataUiId } from '../common/utils';
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

  test('Chat pane opens and displays correctly', async ({ pages }) => {
    const page = pages[0];
    await page.click(dataUiId('meeting-composite-chat-button'));
    await page.waitForSelector(dataUiId('meeting-composite-chat-pane'));
    expect(await page.screenshot()).toMatchSnapshot(`meeting-chat-pane-open-screen.png`, { threshold: 0.5 });

    // @TODO: future tests to test sending chat messages
  });

  test('People pane opens and displays correctly', async ({ pages }) => {
    const page = pages[0];
    await page.click(dataUiId('meeting-composite-people-button'));
    await page.waitForSelector(dataUiId('meeting-composite-people-pane'));
    expect(await page.screenshot()).toMatchSnapshot(`meeting-people-pane-screen.png`, { threshold: 0.5 });

    // @TODO: future tests to verify expected people and interacting with participants
  });

  /**
   * @TODO: Further tests:
   *   - Teams lobby screen
   *   - Leave meeting
   *   - Viewport sizes
   */
});
