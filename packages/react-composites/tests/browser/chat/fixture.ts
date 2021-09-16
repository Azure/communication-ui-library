// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatUserType, createChatThreadAndUsers, loadPage, PAGE_VIEWPORT } from '../common/utils';
import { startServer, stopServer } from '../../server';
import { chromium, Browser, Page, test as base } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SERVER_URL = 'http://localhost:3000';
const PARTICIPANTS = ['Dorian Gutmann', 'Kathleen Carroll'];

export interface ChatWorkerFixtures {
  serverUrl: string;
  testBrowser: Browser;
  users: ChatUserType[];
  pages: Array<Page>;
}

/**
 * A worker-scoped test fixture for ChatComposite browser tests.
 */
export const test = base.extend<unknown, ChatWorkerFixtures>({
  /**
   * Run a server to serve the ChatComposite example app.
   *
   * @returns string URL for the server.
   */
  serverUrl: [
    // playwright forces us to use a destructuring pattern for first argument.
    /* eslint-disable-next-line no-empty-pattern */
    async ({}, use) => {
      await startServer(path.join(__dirname, 'app'));
      try {
        await use(SERVER_URL);
      } finally {
        await stopServer();
      }
    },
    { scope: 'worker' }
  ],
  /**
   * Starts a test browser to load the ChatComposite example app.
   *
   * @returns Browser object.
   */
  testBrowser: [
    // playwright forces us to use a destructuring pattern for first argument.
    /* eslint-disable-next-line no-empty-pattern */
    async ({}, use) => {
      const browser = await chromium.launch({
        args: [
          `--window-size=${Object.values(PAGE_VIEWPORT).join(',')}`,
          '--disable-gpu', // Ensures that fonts are rendered consistently.
          '--font-render-hinting=none', // Ensures that fonts are rendered consistently.
          '--enable-font-antialiasing' // Ensures that fonts are rendered consistently.
        ],
        ignoreDefaultArgs: [
          '--hide-scrollbars' // Don't hide scrollbars in headless mode.
        ],
        headless: true
      });
      try {
        await use(browser);
      } finally {
        await browser.close();
      }
    },
    { scope: 'worker' }
  ],
  /**
   * Creates a Chat thread and adds users to the thread.
   *
   * @returns the created users' identities.
   */
  users: [
    // playwright forces us to use a destructuring pattern for first argument.
    /* eslint-disable-next-line no-empty-pattern */
    async ({}, use) => {
      const users = await createChatThreadAndUsers(PARTICIPANTS);
      await use(users);
    },
    { scope: 'worker' }
  ],
  /**
   * Loads the ChatComposite example app for each participant in a browser page.
   *
   * @returns Array of Page's loaded, one for each participant.
   */
  pages: [
    async ({ serverUrl, testBrowser, users }, use) => {
      const pages = await Promise.all(users.map(async (user) => loadPage(testBrowser, serverUrl, user)));
      await use(pages);
    },
    { scope: 'worker' }
  ]
});
