// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Page, test as base } from '@playwright/test';
import path from 'path';
import { createTestServer } from '../../../server';
import { TEST_PARTICIPANTS_CHAT } from '../../common/constants';
import { bindConsoleErrorForwarding, loadNewPage } from '../../common/fixtureHelpers';
import { encodeQueryData } from '../../common/utils';
import { FileMetadata } from '@internal/react-components';

const SERVER_URL = 'http://localhost:3000';
const APP_DIR = path.join(__dirname, '../app');

interface WorkerFixture {
  serverUrl: string;
  page: Page;
}

export type FileUpload = FileMetadata & { uploadComplete?: boolean; error?: string; progress?: number };

export type FakeChatAdapterArgs = {
  localParticipant: string;
  remoteParticipants: string[];
  localParticipantPosition?: number;
  fileUploads?: FileUpload[];
};

/**
 * Create the test URL for chat app with using fake adapter
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param fakeChatAdapterArgs - Args for fake adapter setup to add to the query search parameters of the URL.
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 * @returns URL string
 */
export const buildUrlForChatAppUsingFakeAdapter = (
  serverUrl: string,
  fakeChatAdapterArgs: FakeChatAdapterArgs,
  qArgs?: { [key: string]: string }
): string => {
  let url = `${serverUrl}?fakeChatAdapterArgs=${JSON.stringify(fakeChatAdapterArgs)}`;
  if (qArgs) {
    url += `&${encodeQueryData({ ...qArgs })}`;
  }
  return url;
};

/**
 * Fake chat adapter args
 */
export const FAKE_CHAT_ADAPTER_ARGS = {
  localParticipant: TEST_PARTICIPANTS_CHAT[0],
  remoteParticipants: TEST_PARTICIPANTS_CHAT.slice(1)
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePage = async ({ serverUrl, browser }, use) => {
  const page = await loadNewPage(browser, buildUrlForChatAppUsingFakeAdapter(serverUrl, FAKE_CHAT_ADAPTER_ARGS));
  bindConsoleErrorForwarding(page);
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
