// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TEST_PARTICIPANTS } from '../common/constants';
import { createCallAndChatUsers, usePagePerParticipantWithCallPermissions } from '../common/fixtureHelpers';
import { WorkerFixture, CallAndChatUserType } from '../common/fixtureTypes';
import { createTestServer } from '../../server';
import { test as base } from '@playwright/test';
import path from 'path';

const SERVER_URL = 'http://localhost:3000';
const APP_DIR = path.join(__dirname, 'app');

type CallAndChatWorkerFixture = WorkerFixture<CallAndChatUserType>;

/**
 * A worker-scoped test fixture for CallAndChatComposite browser tests.
 *
 * The @returns values are available to reference in tests.
 */
export const test = base.extend<unknown, CallAndChatWorkerFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ appDir: APP_DIR, serverUrl: SERVER_URL }), { scope: 'worker' }],

  /** @returns the created users' identities. */
  users: [createCallAndChatUsers(TEST_PARTICIPANTS), { scope: 'worker' }],

  /** @returns Array of Page's loaded. In our case: one for each participant. */
  pages: [usePagePerParticipantWithCallPermissions, { scope: 'worker' }]
});
