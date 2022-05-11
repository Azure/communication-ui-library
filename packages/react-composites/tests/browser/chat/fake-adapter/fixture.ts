// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Page, test as base } from '@playwright/test';
import path from 'path';
import { createTestServer } from '../../../server';
import { TEST_PARTICIPANTS_CHAT } from '../../common/constants';
import { bindConsoleErrorForwarding, loadNewPage } from '../../common/fixtureHelpers';
import { encodeQueryData } from '../../common/utils';

const SERVER_URL = 'http://localhost:3000';
const APP_DIR = path.join(__dirname, '../app');

interface WorkerFixture {
  serverUrl: string;
  page: Page;
}

export type ChatAdapterModel = { localParticipant: string; remoteParticipants: string[] };

/**
 * Create the test URL for chat app with using fake adapter
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 * @returns URL string
 */
export const buildUrlForChatAppUsingFakeAdapter = (
  serverUrl: string,
  fakeChatAdapterModel: ChatAdapterModel,
  qArgs?: { [key: string]: string }
): string => {
  let url = `${serverUrl}?fakeChatAdapterModel=${JSON.stringify(fakeChatAdapterModel)}`;
  if (qArgs) {
    url += `&${encodeQueryData({ ...qArgs })}`;
  }
  return url;
};

/**
 * Base chat adapter model
 */
export const BASE_CHAT_ADAPTER_MODEL = {
  localParticipant: TEST_PARTICIPANTS_CHAT[0],
  remoteParticipants: TEST_PARTICIPANTS_CHAT.splice(1)
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePage = async ({ serverUrl, browser }, use) => {
  const page = await loadNewPage(browser, buildUrlForChatAppUsingFakeAdapter(serverUrl, BASE_CHAT_ADAPTER_MODEL));
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
