// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS, TEST_PARTICIPANTS } from '../common/constants';
import {
  buildUrl,
  dataUiId,
  loadCallPageWithParticipantVideos,
  pageClick,
  stubMessageTimestamps,
  turnOffAllVideos,
  waitForCallCompositeToLoad,
  waitForMeetingCompositeToLoad,
  waitForSelector
} from '../common/utils';
import { test } from './fixture';
import { expect, Page } from '@playwright/test';
import { v1 as generateGUID } from 'uuid';
import { sendMessage, waitForMessageDelivered, waitForMessageSeen } from '../common/chatTestHelpers';
import { createMeetingObjectsAndUsers } from '../common/fixtureHelpers';
import { MeetingUserType } from '../common/fixtureTypes';

test.describe('Meeting Composite Pre-Join Tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await meetingTestSetup({ pages, users, serverUrl });
  });

  test('Pre-join screen loads correctly', async ({ pages }) => {
    const page = pages[0];
    expect(await page.screenshot()).toMatchSnapshot(`meeting-pre-join-screen.png`);
  });
});

test.describe('Meeting Composite Meeting Page Tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await meetingTestSetup({ pages, users, serverUrl });
    await loadCallPageWithParticipantVideos(pages);
  });

  test('Meeting gallery screen loads correctly', async ({ pages }) => {
    const page = pages[0];
    expect(await page.screenshot()).toMatchSnapshot(`meeting-gallery-screen.png`);
  });

  test('Chat messages are displayed correctly', async ({ pages }) => {
    // Open chat pane on page 0 and send a message
    await pageClick(pages[0], dataUiId('meeting-composite-chat-button'));
    await waitForSelector(pages[0], dataUiId('meeting-composite-chat-pane'));
    await sendMessage(pages[0], 'Meeting composite is awesome!');

    // Open chat pane on page 1 and send a response
    await pageClick(pages[1], dataUiId('meeting-composite-chat-button'));
    await waitForSelector(pages[1], dataUiId('meeting-composite-chat-pane'));
    await sendMessage(pages[1], 'I agree!');
    await waitForMessageDelivered(pages[1]);

    // Test page 0 has both sent message and received message
    await waitForMessageSeen(pages[0]);
    await waitForMessageSeen(pages[1]);

    // Ensure typing indicator has disappeared to prevent flakey test
    await pages[0].bringToFront();
    const typingIndicator = await pages[0].$(dataUiId(IDS.typingIndicator));
    typingIndicator && (await typingIndicator.waitForElementState('hidden'));

    await stubMessageTimestamps(pages[0]);
    expect(await pages[0].screenshot()).toMatchSnapshot(`meeting-gallery-screen-with-chat-pane.png`);
  });

  test('People pane opens and displays correctly', async ({ pages }) => {
    const page = pages[1];
    await pageClick(page, dataUiId('meeting-composite-people-button'));
    await waitForSelector(page, dataUiId('meeting-composite-people-pane'));
    expect(await page.screenshot()).toMatchSnapshot(`meeting-gallery-screen-with-people-pane.png`);
  });

  /**
   * @TODO: Further tests:
   *   - Teams lobby screen
   *   - Leave meeting
   */
});

test.describe('Meeting composite custom button injection tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(
        buildUrl(serverUrl, user, {
          injectCustomButtons: 'true'
        })
      );
      await waitForCallCompositeToLoad(page);
    }
    await loadCallPageWithParticipantVideos(pages);
  });

  test('injected buttons appear', async ({ pages }) => {
    // TODO: Remove this function when we fix unstable contextual menu bug
    // Bug link: https://skype.visualstudio.com/SPOOL/_workitems/edit/2558377/?triage=true
    await turnOffAllVideos(pages);

    const page = pages[0];
    expect(await page.screenshot()).toMatchSnapshot(`custom-buttons.png`);
  });
});

export const meetingTestSetup = async ({
  pages,
  users,
  serverUrl,
  qArgs
}: {
  pages: Page[];
  users: MeetingUserType[];
  serverUrl: string;
  /** optional query parameters for the page url */
  qArgs?: { [key: string]: string };
}): Promise<void> => {
  // ensure calls and chats are always unique per test
  users = await createMeetingObjectsAndUsers(TEST_PARTICIPANTS);
  for (const i in pages) {
    const page = pages[i];
    const user = users[i];
    await page.goto(buildUrl(serverUrl, user, qArgs));
    await waitForMeetingCompositeToLoad(page);
  }
};
