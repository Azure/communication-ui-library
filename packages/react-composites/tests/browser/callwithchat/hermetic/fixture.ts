// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Page, test as base } from '@playwright/test';
import path from 'path';
import { createTestServer } from '../../common/server';
import { loadNewPageWithPermissionsForCalls } from '../../common/fixtureHelpers';
import {
  dataUiId,
  encodeQueryData,
  jsonDateReplacer,
  waitForPageFontsLoaded,
  waitForSelector
} from '../../common/utils';
import type { MockCallAdapterState, MockRemoteParticipantState } from '../../../common';
import type { ChatParticipant } from '@azure/communication-chat';
import type { _FakeChatAdapterArgs } from '../../../../src';

const SERVER_URL = 'http://localhost';
const APP_DIR = path.join(__dirname, '../../../app/callwithchat');

/**
 * Selector for the root <div> that contains the app under test.
 *
 * Useful to better target selectors to be within the test app,
 * exlucding the hidden chat composites etc.
 */
export const APP_UNDER_TEST_ROOT_SELECTOR = '#app-under-test-root';

/**
 * Create the test URL.
 *
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param mockCallAdapterState - Initial state for the {@link MockCallAdapter} constructed by the test app.
 * @param fakeChatAdapterArgs - Args for fake adapter setup to add to the query search parameters of the URL.
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 *
 * @returns URL string
 */
export const buildUrlForApp = (
  serverUrl: string,
  mockCallAdapterState: MockCallAdapterState,
  fakeChatAdapterArgs: _FakeChatAdapterArgs,
  qArgs?: { [key: string]: string }
): string => {
  return `${serverUrl}?${encodeQueryData({
    mockCallAdapterState: JSON.stringify(mockCallAdapterState, jsonDateReplacer),
    fakeChatAdapterArgs: JSON.stringify(fakeChatAdapterArgs),
    ...qArgs
  })}`;
};

export interface TestFixture {
  serverUrl: string;
  page: Page;
}

const usePage = async ({ browser }, use): Promise<void> => {
  await use(await loadNewPageWithPermissionsForCalls(browser));
};

/**
 * A test-scoped test fixture for hermetic {@link CallWithChatComposite} browser tests.
 *
 * This fixture runs the test app with a fake {@link CallWithChatAdapter}, avoiding
 * any communication with the real Azure Communiction Services backend services.
 */
export const test = base.extend<TestFixture>({
  /** @returns string URL for the server. */
  serverUrl: [createTestServer({ appDir: APP_DIR, serverUrl: SERVER_URL }), { scope: 'test' }],
  /** @returns An empty browser page. Tests should load the app via page.goto(). */
  page: [usePage, { scope: 'test' }]
});

/**
 * Given a {@link MockCallAdapterState},
 *   - construct the corresponding chat state.
 *   - load the hermetic CallWithChat test app on the page.
 *   - wait for the page to have completely loaded.
 */
export async function loadCallPage(
  page: Page,
  serverUrl: string,
  callState: MockCallAdapterState,
  qArgs?: { [key: string]: string } // TODO: more strongly type this with a type like: `Partial<Record<keyof QueryArgs, string>>`
): Promise<void> {
  const chatArgs = fakeChatAdapterArgsForCallAdapterState(callState);
  await page.goto(buildUrlForApp(serverUrl, callState, chatArgs, qArgs));
  await waitForPageFontsLoaded(page);
  await waitForSelector(page, dataUiId('call-composite-hangup-button'));
}

/**
 * Construct {@link FakeChatAdapterArgs} from a prepopulated {@link MockCallAdapterState}.
 */
function fakeChatAdapterArgsForCallAdapterState(state: MockCallAdapterState): _FakeChatAdapterArgs {
  const remoteParticipants = Object.values(state.call?.remoteParticipants ?? {}).map(chatParticipantFor);
  return {
    localParticipant: {
      id: state.userId,
      displayName: state.displayName
    },
    remoteParticipants,
    participantsWithHiddenComposites: remoteParticipants
  };
}

/**
 * Get a {@link ChatParticipant} for a {@link MockRemoteParticipantState}.
 *
 * Useful in interacting with the {@link HiddenChatComposite} in a callwithchat {@link HermeticApp}.
 */
export const chatParticipantFor = (p: MockRemoteParticipantState): ChatParticipant => ({
  id: p.identifier,
  displayName: p.displayName
});
