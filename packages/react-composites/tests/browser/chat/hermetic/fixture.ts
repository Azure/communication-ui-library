// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { Page, test as base } from '@playwright/test';
import { nanoid } from 'nanoid';
import path from 'path';
import { createTestServer } from '../../common/server';
import { TEST_PARTICIPANTS_CHAT } from '../../common/constants';
import { loadNewPage } from '../../common/fixtureHelpers';
import type { _FakeChatAdapterArgs } from '../../../../src';

const SERVER_URL = 'http://localhost';
const APP_DIR = path.join(__dirname, '../../../app/chat');

interface WorkerFixture {
  serverUrl: string;
  page: Page;
}

/**
 * Create the test URL for chat app with using fake adapter
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param fakeChatAdapterArgs - Args for fake adapter setup to add to the query search parameters of the URL.
 * @returns URL string
 */
export const buildUrlForChatAppUsingFakeAdapter = (
  serverUrl: string,
  fakeChatAdapterArgs: _FakeChatAdapterArgs
): string => {
  return `${serverUrl}?fakeChatAdapterArgs=${JSON.stringify(fakeChatAdapterArgs)}`;
};

/**
 * Chat participants for fake adapter tests
 */
export const TEST_PARTICIPANTS: ChatParticipant[] = TEST_PARTICIPANTS_CHAT.map((p) => {
  return { id: { communicationUserId: nanoid() }, displayName: p };
});

/**
 * Default fake chat adapter args
 */
export const DEFAULT_FAKE_CHAT_ADAPTER_ARGS = {
  localParticipant: TEST_PARTICIPANTS[0],
  remoteParticipants: TEST_PARTICIPANTS.slice(1)
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePage = async ({ serverUrl, browser }, use) => {
  const page = await loadNewPage(
    browser,
    buildUrlForChatAppUsingFakeAdapter(serverUrl, DEFAULT_FAKE_CHAT_ADAPTER_ARGS)
  );
  await use(page);
};

/**
 * A test-scoped test fixture for ChatComposite browser tests.
 *
 * The @returns values are available to reference in tests.
 */
export const test = base.extend<WorkerFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ appDir: APP_DIR, serverUrl: SERVER_URL }), { scope: 'test' }],

  /** @returns Array of Page's loaded. In our case: one for each participant. */
  page: [usePage, { scope: 'test' }]
});
