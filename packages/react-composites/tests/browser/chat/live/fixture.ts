// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TEST_PARTICIPANTS_CHAT } from '../../common/constants';
import { createChatUsers, usePagePerParticipant } from '../../common/fixtureHelpers';
import { WorkerFixture, ChatUserType } from '../../common/fixtureTypes';
import { createTestServer } from '../../common/server';
import { test as base } from '@playwright/test';
import path from 'path';

const SERVER_URL = 'http://localhost';
const APP_DIR = path.join(__dirname, '../../../app/chat');

type ChatWorkerFixture = WorkerFixture<ChatUserType>;

/**
 * A test-scoped test fixture for ChatComposite browser tests.
 *
 * The @returns values are available to reference in tests.
 */
export const test = base.extend<ChatWorkerFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ appDir: APP_DIR, serverUrl: SERVER_URL }), { scope: 'test' }],

  /** @returns the created users' identities. */
  users: [createChatUsers(TEST_PARTICIPANTS_CHAT), { scope: 'test' }],

  /** @returns Array of Page's loaded. In our case: one for each participant. */
  pages: [usePagePerParticipant, { scope: 'test' }]
});
