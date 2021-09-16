// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingUserType, createMeetingUsers, loadPageWithPermissionsForCalls, PAGE_VIEWPORT } from '../common/utils';
import { startServer, stopServer } from '../../server';
import { chromium, Browser, Page, test as base } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SERVER_URL = 'http://localhost:3000';
const PARTICIPANTS = ['Dorian Gutmann', 'Kathleen Carroll'];

interface CompositeAppWorkerFixtures {
  serverUrl: string;
  testBrowser: Browser;
  users: MeetingUserType[];
  pages: Array<Page>;
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * A worker-scoped test fixture for ChatComposite browser tests.
 */
export const test = base.extend<unknown, CompositeAppWorkerFixtures>({
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
          `--use-file-for-fake-video-capture=${path.join(__dirname, '..', 'common', 'test.y4m')}`,
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
  users: [
    // playwright forces us to use a destructuring pattern for first argument.
    /* eslint-disable-next-line no-empty-pattern */
    async ({}, use) => {
      const users = await createMeetingUsers(PARTICIPANTS);
      await use(users);
    },
    { scope: 'worker' }
  ],
  pages: [
    async ({ serverUrl, testBrowser, users }, use) => {
      const pages = await Promise.all(
        users.map(async (user) => loadPageWithPermissionsForCalls(testBrowser, serverUrl, user))
      );
      await use(pages);
    },
    { scope: 'worker' }
  ]
});
