// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useChromeBrowser } from '../common/browsers';
import { TEST_PARTICIPANTS, WorkerFixture, MeetingUserType } from '../common/defaults';
import { createMeetingUsers, usePagePerParticipantWithCallPermissions } from '../common/utils';
import { createTestServer } from '../../server';
import { test as base } from '@playwright/test';
import path from 'path';

const SERVER_URL = 'http://localhost:3000';

type MeetingWorkerFixture = WorkerFixture<MeetingUserType>;

/**
 * A worker-scoped test fixture for MeetingComposite browser tests.
 *
 * The @returns values are available to reference in tests.
 */
export const test = base.extend<unknown, MeetingWorkerFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ appDir: path.join(__dirname, 'app'), serverUrl: SERVER_URL }), { scope: 'worker' }],

  /** @returns Browser object. */
  testBrowser: [useChromeBrowser, { scope: 'worker' }],

  /** @returns the created users' identities. */
  users: [createMeetingUsers(TEST_PARTICIPANTS), { scope: 'worker' }],

  /** @returns Array of Page's loaded. In our case: one for each participant. */
  pages: [usePagePerParticipantWithCallPermissions, { scope: 'worker' }]
});
