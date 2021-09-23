// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useChromeBrowser } from '../browsers';
import { TEST_PARTICIPANTS, WorkerFixture } from '../defaults';
import {
  CallUserType,
  createCallUsers,
  createTestServer,
  usePagePerParticipantWithCallPermissions
} from '../common/utils';
import { startServer, stopServer } from './app/server';
import { test as base } from '@playwright/test';

const SERVER_URL = 'http://localhost:3000';

type CallWorkerFixture = WorkerFixture<CallUserType>;

/**
 * A worker-scoped test fixture for CallComposite browser tests.
 *
 * The @returns values are available to reference in tests.
 */
export const test = base.extend<unknown, CallWorkerFixture>({
  /** @returns string URL for the server. */
  // await startServer(path.join(__dirname, 'app'));
  serverUrl: [createTestServer(startServer, stopServer, SERVER_URL), { scope: 'worker' }],

  /** @returns Browser object. */
  testBrowser: [useChromeBrowser, { scope: 'worker' }],

  /** @returns the created users' identities. */
  users: [createCallUsers(TEST_PARTICIPANTS), { scope: 'worker' }],

  /** @returns Array of Page's loaded. In our case: one for each participant. */
  pages: [usePagePerParticipantWithCallPermissions, { scope: 'worker' }]
});
