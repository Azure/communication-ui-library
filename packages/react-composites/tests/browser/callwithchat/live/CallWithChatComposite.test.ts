// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TEST_PARTICIPANTS } from '../../common/constants';
import {
  buildUrl,
  dataUiId,
  isTestProfileDesktop,
  loadCallPageWithParticipantVideos,
  pageClick,
  stableScreenshot,
  waitForCallWithChatCompositeToLoad,
  waitForPiPiPToHaveLoaded,
  waitForSelector
} from '../../common/utils';
import { test } from './fixture';
import { expect, Page } from '@playwright/test';
import { createCallWithChatObjectsAndUsers } from '../../common/fixtureHelpers';
import { CallWithChatUserType } from '../../common/fixtureTypes';

test.describe('CallWithChat Composite Pre-Join Tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await callWithChatTestSetup({ pages, users, serverUrl });
  });

  test('Pre-join screen loads correctly', async ({ pages }) => {
    const page = pages[0];
    if (!page) {
      throw new Error('Pages[0] not found');
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-with-chat-pre-join-screen.png`);
  });
});

test.describe('CallWithChat Composite CallWithChat Page Tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await callWithChatTestSetup({ pages, users, serverUrl });
    await loadCallPageWithParticipantVideos(pages);
  });

  test('People pane opens and displays correctly', async ({ pages }, testInfo) => {
    const page = pages[1];
    if (!page) {
      throw new Error('Pages[1] not found');
    }

    if (isTestProfileDesktop(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-people-button'));
    } else {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      const drawerPeopleMenuDiv = await page.$('div[role="menu"] >> text=People');
      await drawerPeopleMenuDiv?.click();
    }
    await waitForSelector(page, dataUiId('people-pane-content'));

    if (!isTestProfileDesktop(testInfo)) {
      await waitForPiPiPToHaveLoaded(page);
    }

    expect(await stableScreenshot(page)).toMatchSnapshot(`call-with-chat-gallery-screen-with-people-pane.png`);
  });

  test('More Drawer menu opens and can choose to be on hold', async ({ pages }) => {
    const page = pages[1];
    if (!page) {
      throw new Error('Pages[1] not found');
    }

    await pageClick(page, dataUiId('common-call-composite-more-button'));
    const moreButtonHoldCallButton = await page.$('div[role="menu"] >> text="Hold call"');
    await moreButtonHoldCallButton?.click();

    await waitForSelector(page, dataUiId('hold-page'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-with-chat-more-drawer-hold-call.png`);
  });
});

export const callWithChatTestSetup = async ({
  pages,
  users,
  serverUrl,
  qArgs
}: {
  pages: Page[];
  users: CallWithChatUserType[];
  serverUrl: string;
  /** optional query parameters for the page url */
  qArgs?: { [key: string]: string };
}): Promise<void> => {
  // ensure calls and chats are always unique per test
  users = await createCallWithChatObjectsAndUsers(TEST_PARTICIPANTS);
  for (const i in pages) {
    const page = pages[i];
    const user = users[i];

    if (!page || !user) {
      throw new Error('Page and user must be defined');
    }

    await page.goto(buildUrl(serverUrl, user, qArgs));
    await waitForCallWithChatCompositeToLoad(page);
  }
};
