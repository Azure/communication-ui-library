// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Page, test as base } from '@playwright/test';
import path from 'path';
import { createTestServer } from '../../../server';
import { bindConsoleErrorForwarding } from '../../common/fixtureHelpers';
import { encodeQueryData } from '../../common/utils';
import { TestCallingState } from '../TestCallingState';

const SERVER_URL = 'http://localhost';
const APP_DIR = path.join(__dirname, '../app');

/**
 * Create the test URL.
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param user - Test user the props of which populate query search parameters
 * @param state - Calling state of type TestCallingState passed as a query search parameter
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 * @returns URL string
 */
export const buildUrlWithMockAdapter = (
  serverUrl: string,
  testCallingState?: TestCallingState,
  qArgs?: { [key: string]: string }
): string => {
  const state: TestCallingState = testCallingState ?? {};
  return `${serverUrl}?${encodeQueryData({ mockCallState: JSON.stringify(state), ...qArgs })}`;
};

export interface TestFixture {
  serverUrl: string;
  page: Page;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePage = async ({ serverUrl, browser }, use) => {
  const context = await browser.newContext({ permissions: ['notifications', 'camera', 'microphone'] });
  const page = await context.newPage();
  bindConsoleErrorForwarding(page);
  await use(page);
};

/**
 * A test-scoped test fixture for hermetic {@link CallComposite} browser tests.
 *
 * This fixture runs the test app with a mock {@link CallAdapter}, avoiding
 * any communication with the real Azure Communiction Services backend services.
 */
export const test = base.extend<TestFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ appDir: APP_DIR, serverUrl: SERVER_URL }), { scope: 'test' }],

  /** @returns An empty browser page. Tests should load the app via page.goto(). */
  page: [usePage, { scope: 'test' }]
});
