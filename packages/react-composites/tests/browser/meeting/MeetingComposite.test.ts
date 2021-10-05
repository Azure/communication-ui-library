// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from '../common/config';
import { dataUiId, loadUrlInPage, stubMessageTimestamps } from '../common/utils';
import { waitForMeetingCompositeToLoad } from '../common/utils';
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

      await loadUrlInPage(page, serverUrl, user);
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

      await loadUrlInPage(page, serverUrl, user);
      await waitForMeetingCompositeToLoad(page);

      // Join Meeting for each participant
      const startCallButton = await page.waitForSelector(dataUiId('call-composite-start-call-button'));
      await startCallButton.waitForElementState('enabled');
      await page.click(dataUiId('call-composite-start-call-button'));
    }

    // Ensure meeting composites have successfully loaded and joined meeting
    for (const page of pages) {
      await page.bringToFront();
      await page.waitForFunction(
        (args) => {
          const tileNodes = document.querySelectorAll(args.participantTileSelector);
          const correctNoOfTiles = tileNodes.length === args.expectedTileCount;
          return correctNoOfTiles;
        },
        { participantTileSelector: dataUiId('video-tile'), expectedTileCount: pages.length }
      );
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
    await pages[1].bringToFront();
    await pages[1].waitForSelector(`[data-ui-status="seen"]`);

    // Ensure typing indicator has disappeared to prevent flakey test
    await pages[0].bringToFront();
    const typingIndicator = await pages[0].$(dataUiId(IDS.typingIndicator));
    typingIndicator && (await typingIndicator.waitForElementState('hidden'));

    await stubMessageTimestamps(pages[0]);
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
