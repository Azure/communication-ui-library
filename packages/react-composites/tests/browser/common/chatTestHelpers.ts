// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IDS } from './constants';
import {
  dataUiId,
  dataTestId,
  stubMessageTimestamps,
  waitForChatCompositeToLoad,
  buildUrl,
  waitForSelector,
  waitForFunction,
  perStepLocalTimeout
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
    const user = usersWithArgs[idx]?.user;
    if (!page || !user) {
      throw new Error('Page and user must be defined');
    }

    const qArgs = usersWithArgs[idx]?.qArgs ?? {};
    await page.goto(buildUrl(serverUrl, user, qArgs));
    pageLoadPromises.push(waitForChatCompositeToLoad(page));
    await stubMessageTimestamps(page);
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

/**
 * Wait for typing indicators to appear and then dismiss them before continuing.
 *
 * Only select typing indicators under the targeted root node. By default, this means anywhere in the <body>.
 */
export const waitForAndHideTypingIndicator = async (page: Page, rootSelector = 'body'): Promise<void> => {
  await page.bringToFront();
  const indicator = await (await page.locator(rootSelector)).locator(dataUiId(IDS.typingIndicator));
  // First make sure that the typing indicator appears.
  await indicator.waitFor({
    state: 'visible',
    timeout: perStepLocalTimeout()
  });
  // Advance time to make the typing indicator disappear.
  await page.evaluate(() => {
    const currentDate = new Date();
    // Typing indicator internal timeout is 10 seconds, so advance by
    // a larger number.
    currentDate.setSeconds(currentDate.getSeconds() + 11);
    Date.now = () => currentDate.getTime();
  });
  // Now wait for the indicator to disappear.
  await indicator.waitFor({
    state: 'hidden',
    timeout: perStepLocalTimeout()
  });
};

/**
 * Wait for N messages to appear in the message thread.
 *
 * Only select messages under the targeted root node. By default, this means anywhere in the <body>.
 */
export const waitForNMessages = async (page: Page, n: number, rootSelector = 'body'): Promise<void> => {
  return waitForNOf(page, n, rootSelector, dataTestId(IDS.messageTimestamp));
};

const waitForNOf = async (page: Page, n: number, rootSelector: string, selector: string): Promise<void> => {
  await waitForFunction(
    page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => {
      const { n, rootSelector, selector } = args;
      const root = document.querySelector(rootSelector);
      const items = root.querySelectorAll(selector);
      return items.length === n;
    },
    { n, rootSelector, selector }
  );
};
