// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createTestServer } from '../../../server';
import { ConsoleMessage, Page, test as base } from '@playwright/test';
import path from 'path';
import { loadNewPage } from '../../common/fixtureHelpers';
import { TEST_PARTICIPANTS_CHAT } from '../../common/constants';
import { encodeQueryData } from '../../common/utils';

const SERVER_URL = 'http://localhost:3000';
const APP_DIR = path.join(__dirname, '../app');

interface WorkerFixture {
  serverUrl: string;
  page: Page;
}

export type ChatAdapterModel = { users: string[] };

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePage = async ({ serverUrl, browser }, use) => {
  const page = await loadNewPage(
    browser,
    buildUrlForChatAppUsingFakeAdapter(serverUrl, {
      users: TEST_PARTICIPANTS_CHAT
    })
  );
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

const bindConsoleErrorForwarding = (page: Page): Page =>
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !shouldIgnoreConsoleError(msg)) {
      console.log(`CONSOLE ERROR >> "${msg.text()}"`, msg.args(), msg.location());
    }
  });

const shouldIgnoreConsoleError = (error: ConsoleMessage): boolean => {
  // ignore SDK telemetry throttling error
  return KNOWN_TELEMETRY_ERROR_MESSAGES.includes(error.text()) && error.location().url.includes(KNOWN_TELEMETRY_ORIGIN);
};

const KNOWN_TELEMETRY_ERROR_MESSAGES = [
  'Failed to load resource: the server responded with a status of 403 (No events are from an allowed domain.)',
  'Failed to load resource: the server responded with a status of 403 (All Events Throttled.)'
];
const KNOWN_TELEMETRY_ORIGIN = 'events.data.microsoft.com/OneCollector';
