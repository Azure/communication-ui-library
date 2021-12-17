// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './constants';
import { dataUiId, stubMessageTimestamps, waitForChatCompositeToLoad, buildUrl, waitForSelector } from './utils';
import { createChatThreadAndUsers } from './fixtureHelpers';
import { Page } from '@playwright/test';
import { ChatUserType } from './fixtureTypes';

const PARTICIPANTS = ['Dorian Gutmann', 'Poppy Bjørgen'];

/**
 * Load both chat users for UI tests.
 * This should be run before each chat test.
 */
export const chatTestSetup = async ({
  pages,
  users,
  serverUrl,
  qArgs
}: {
  pages: Page[];
  users: ChatUserType[];
  serverUrl: string;
  /** optional query parameters for the page url */
  qArgs?: { [key: string]: string };
}): Promise<void> => {
  users = await createChatThreadAndUsers(PARTICIPANTS);
  const pageLoadPromises: Promise<unknown>[] = [];
  for (const idx in pages) {
    const page = pages[idx];
    const user = users[idx];
    await page.goto(buildUrl(serverUrl, user, qArgs));
    pageLoadPromises.push(waitForChatCompositeToLoad(page));
    await stubMessageTimestamps(pages[idx]);
  }
  await Promise.all(pageLoadPromises);
};

export const sendMessage = async (page: Page, message: string): Promise<void> => {
  await page.bringToFront();
  await page.type(dataUiId(IDS.sendboxTextField), message);
  await page.keyboard.press('Enter');
};

export const waitForSendMessageFailure = async (page: Page): Promise<void> => {
  await page.bringToFront();
  await waitForSelector(page, '[data-ui-status="failed"]');
};

export const waitForMessageDelivered = async (page: Page): Promise<void> => {
  await page.bringToFront();
  await waitForSelector(page, '[data-ui-status="delivered"]');
};

export const waitForMessageSeen = async (page: Page): Promise<void> => {
  await page.bringToFront();
  await waitForSelector(page, '[data-ui-status="seen"]');
};

export const waitForMessageWithContent = async (page: Page, messageContent: string): Promise<void> => {
  await page.bringToFront();
  await waitForSelector(page, `.ui-chat__message__content :text("${messageContent}")`);
};
