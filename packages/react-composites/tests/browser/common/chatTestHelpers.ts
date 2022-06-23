// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './constants';
import {
  dataUiId,
  stubMessageTimestamps,
  waitForChatCompositeToLoad,
  buildUrl,
  waitForSelector,
  waitForFunction
} from './utils';
import { Page } from '@playwright/test';
import { ChatUserType } from './fixtureTypes';

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
  const usersWithArgs = users.map((user) => ({
    user,
    qArgs
  }));
  await chatTestSetupWithPerUserArgs({ pages, usersWithArgs, serverUrl });
};

export const chatTestSetupWithPerUserArgs = async ({
  pages,
  usersWithArgs,
  serverUrl
}: {
  pages: Page[];
  usersWithArgs: { user: ChatUserType; qArgs?: { [key: string]: string } }[];
  serverUrl: string;
}): Promise<void> => {
  const pageLoadPromises: Promise<unknown>[] = [];
  for (const idx in pages) {
    const page = pages[idx];
    const user: ChatUserType = usersWithArgs[idx].user;
    const qArgs = usersWithArgs[idx].qArgs ? usersWithArgs[idx].qArgs : {};
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

export const waitForMessageDelivered = async (
  page: Page,
  options?: { state?: 'visible' | 'attached' }
): Promise<void> => {
  await page.bringToFront();
  await waitForSelector(page, '[data-ui-status="delivered"]', options);
};

export const waitForMessageSeen = async (page: Page): Promise<void> => {
  await page.bringToFront();
  await waitForSelector(page, '[data-ui-status="seen"]');
};

export const waitForMessageWithContent = async (page: Page, messageContent: string): Promise<void> => {
  await page.bringToFront();
  await waitForSelector(page, `.ui-chat__message__content :text("${messageContent}")`);
};

export const waitForTypingIndicatorHidden = async (page: Page): Promise<void> => {
  await page.bringToFront();
  await page.waitForTimeout(1000); // ensure typing indicator has had time to appear
  const typingIndicator = await page.$(dataUiId(IDS.typingIndicator));
  typingIndicator && (await typingIndicator.waitForElementState('hidden')); // ensure typing indicator has now disappeared
};

export const waitForNSeenMessages = async (page: Page, n: number): Promise<void> => {
  await waitForFunction(
    page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (args: any) => {
      // fun fact: everything inside this function body is executed by the headless browser page and not the playwright node process
      const seenMessages = document.querySelectorAll(`[data-ui-status="seen"]`);
      return seenMessages.length === args.expectedSeenMessageCount;
    },
    // args parameter to pass from the node process to the headless browser page
    {
      expectedSeenMessageCount: n
    }
  );
};
