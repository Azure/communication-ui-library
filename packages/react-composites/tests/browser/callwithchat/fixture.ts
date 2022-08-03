// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TEST_PARTICIPANTS } from '../common/constants';
import { createCallWithChatUsers, usePagePerParticipantWithCallPermissions } from '../common/fixtureHelpers';
import { WorkerFixture, CallWithChatUserType } from '../common/fixtureTypes';
import { createTestServer } from '../../server';
import { test as base } from '@playwright/test';
import path from 'path';

const SERVER_URL = 'http://localhost';
const APP_DIR = path.join(__dirname, 'app');

type CallWithChatWorkerFixture = WorkerFixture<CallWithChatUserType>;

/**
 * A worker-scoped test fixture for CallWithChatComposite browser tests.
 *
 * The @returns values are available to reference in tests.
 */
export const test = base.extend<Record<string, unknown>, CallWithChatWorkerFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ appDir: APP_DIR, serverUrl: SERVER_URL }), { scope: 'worker' }],

  /** @returns the created users' identities. */
  users: [createCallWithChatUsers(TEST_PARTICIPANTS), { scope: 'worker' }],

  /** @returns Array of Page's loaded. In our case: one for each participant. */
  pages: [usePagePerParticipantWithCallPermissions, { scope: 'worker' }]
});
