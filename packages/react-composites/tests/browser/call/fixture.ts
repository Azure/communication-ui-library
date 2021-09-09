// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallUserType, createCallingUserAndToken, loadCallCompositePage, PAGE_VIEWPORT } from '../utils';
import { startServer, stopServer } from './app/server';
import { chromium, Browser, Page, test as base } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { v1 } from 'uuid';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SERVER_URL = 'http://localhost:3000';
const PARTICIPANTS = ['Dorian Gutmann', 'Kathleen Carroll'];

export interface ChatWorkerFixtures {
  serverUrl: string;
  testBrowser: Browser;
  users: CallUserType[];
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
      await startServer();
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
        // Our calling sdk streaming does not work on chromium 93, remove this line until it gets fixed
        channel: 'chrome',
        args: [
          `--window-size=${Object.values(PAGE_VIEWPORT).join(',')}`,
          '--font-render-hinting=medium', // Ensures that fonts are rendered consistently.
          '--enable-font-antialiasing', // Ensures that fonts are rendered consistently.
          '--disable-gpu', // Ensures that fonts are rendered consistently.
          '--allow-file-access',
          '--use-fake-ui-for-media-stream',
          '--use-fake-device-for-media-stream',
          `--use-file-for-fake-video-capture=${path.join(__dirname, 'test.y4m')}`,
          '--lang=en-US',
          '--mute-audio'
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
      const groupId = v1();
      const users: Array<CallUserType> = [];
      for (const displayName of PARTICIPANTS) {
        const user = await createCallingUserAndToken();
        user.displayName = displayName;
        user.groupId = groupId;
        users.push(user);
      }
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
      const pages = await Promise.all(users.map(async (user) => loadCallCompositePage(testBrowser, serverUrl, user)));
      await use(pages);
    },
    { scope: 'worker' }
  ]
});
