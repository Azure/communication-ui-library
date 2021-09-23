// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useChromeBrowser } from '../common/browsers';
import { TEST_PARTICIPANTS, WorkerFixture, CallUserType } from '../common/defaults';
import { createCallUsers, createTestServer, usePagePerParticipantWithCallPermissions } from '../common/utils';
import { startServer, stopServer } from '../../server';
import { test as base } from '@playwright/test';
import path from 'path';

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
  serverUrl: [
    createTestServer(() => startServer(path.join(__dirname, 'app')), stopServer, SERVER_URL),
    { scope: 'worker' }
  ],

  /** @returns Browser object. */
  testBrowser: [useChromeBrowser, { scope: 'worker' }],

  /** @returns the created users' identities. */
  users: [createCallUsers(TEST_PARTICIPANTS), { scope: 'worker' }],

  /** @returns Array of Page's loaded. In our case: one for each participant. */
  pages: [usePagePerParticipantWithCallPermissions, { scope: 'worker' }]
});
