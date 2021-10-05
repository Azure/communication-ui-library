// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TEST_PARTICIPANTS } from '../common/constants';
import { createCallUsers, usePagePerParticipantWithCallPermissions } from '../common/fixtureHelpers';
import { WorkerFixture, CallUserType } from '../common/fixtureTypes';
import { createTestServer } from '../../server';
import { test as base } from '@playwright/test';
import path from 'path';

const SERVER_URL = 'http://localhost:3000';
const APP_DIR = path.join(__dirname, 'app');

type CallWorkerFixture = WorkerFixture<CallUserType>;

/**
 * A worker-scoped test fixture for CallComposite browser tests.
 *
 * The @returns values are available to reference in tests.
 */
export const test = base.extend<unknown, CallWorkerFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ appDir: APP_DIR, serverUrl: SERVER_URL }), { scope: 'worker' }],

  /** @returns the created users' identities. */
  users: [createCallUsers(TEST_PARTICIPANTS), { scope: 'worker' }],

  /** @returns Array of Page's loaded. In our case: one for each participant. */
  pages: [usePagePerParticipantWithCallPermissions, { scope: 'worker' }]
});
