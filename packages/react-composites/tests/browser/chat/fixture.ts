// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useChromeBrowser } from '../browsers';
import { TEST_PARTICIPANTS, WorkerFixture, ChatUserType } from '../defaults';
import { createChatUsers, createTestServer, usePagePerParticipant } from '../utils';
import { startServer, stopServer } from './app/server';
import { test as base } from '@playwright/test';

const SERVER_URL = 'http://localhost:3000';

type ChatWorkerFixture = WorkerFixture<ChatUserType>;

/**
 * A worker-scoped test fixture for ChatComposite browser tests.
 *
 * The @returns values are available to reference in tests.
 */
export const test = base.extend<unknown, ChatWorkerFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer(startServer, stopServer, SERVER_URL), { scope: 'worker' }],

  /** @returns Browser object. */
  testBrowser: [useChromeBrowser, { scope: 'worker' }],

  /** @returns the created users' identities. */
  users: [createChatUsers(TEST_PARTICIPANTS), { scope: 'worker' }],

  /** @returns Array of Page's loaded. In our case: one for each participant. */
  pages: [usePagePerParticipant, { scope: 'worker' }]
});
