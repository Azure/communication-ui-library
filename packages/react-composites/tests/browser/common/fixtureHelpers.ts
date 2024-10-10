// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatClient } from '@azure/communication-chat';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { Browser, ConsoleMessage, Page, PlaywrightWorkerArgs } from '@playwright/test';
import { v1 } from 'uuid';
import { CHAT_TOPIC_NAME } from './constants';
import { CONNECTION_STRING } from './nodeConstants';
import { ChatUserType, CallUserType, CallWithChatUserType, WorkerFixture } from './fixtureTypes';
import { buildUrl } from './utils';

/**
 * Creates a page to be tested for each participant in a browser page.
 * To be used in a playwright fixture's 'pages'.
 */
// eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePagePerParticipant = async (
  {
    serverUrl,
    users,
    browser
  }: PlaywrightWorkerArgs & WorkerFixture<ChatUserType | CallUserType | CallWithChatUserType>,
  use: (pages: Page[]) => Promise<void>
): Promise<void> => {
  const pages = await Promise.all(
    users.map(
      async (user: ChatUserType | CallUserType | CallWithChatUserType) =>
        await loadNewPage(browser, buildUrl(serverUrl, user))
    )
  );
  await use(pages);
};

const KNOWN_TELEMETRY_ERROR_MESSAGES = [
  'Failed to load resource: the server responded with a status of 403 (No events are from an allowed domain.)',
  'Failed to load resource: the server responded with a status of 403 (All Events Throttled.)'
];
const KNOWN_TELEMETRY_ORIGIN = 'events.data.microsoft.com/OneCollector';

/**
 * Ensure errors on the playwright browser page are forwarded to the test runner console output.
 */
export const bindConsoleErrorForwarding = (page: Page): Page =>
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !shouldIgnoreConsoleError(msg)) {
      console.log(`CONSOLE ERROR >> "${msg.text()}"`, msg.args(), msg.location());
    }
  });

// Ignore known, non-impactful, unfixable console log errors. This should only ignore errors we *CANNOT* fix.
// All console errors should be fixed before considering adding to this function.
const shouldIgnoreConsoleError = (error: ConsoleMessage): boolean => {
  // ignore SDK telemetry throttling error
  return KNOWN_TELEMETRY_ERROR_MESSAGES.includes(error.text()) && error.location().url.includes(KNOWN_TELEMETRY_ORIGIN);
};

/**
 * Creates a page to be tested for each participant in a browser page.
 * To be used in a playwright fixture's 'pages'.
 */
// eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePagePerParticipantWithCallPermissions = async (
  { browser, serverUrl, users }: PlaywrightWorkerArgs & WorkerFixture<CallUserType>,
  use: (pages: Page[]) => Promise<void>
): Promise<void> => {
  const pages = await Promise.all(
    users.map(async (user) => {
      const page = await loadNewPageWithPermissionsForCalls(browser, buildUrl(serverUrl, user));
      bindConsoleErrorForwarding(page);
      return page;
    })
  );
  await use(pages);
};

export const createChatThreadAndUsers = async (displayNames: string[]): Promise<Array<ChatUserType>> => {
  const endpoint = CONNECTION_STRING.replace('endpoint=', '').split(';')[0];
  if (!endpoint) {
    throw new Error('Endpoint URL not found in connection string');
  }
  const endpointUrl = new URL(endpoint).toString();
  const tokenClient = new CommunicationIdentityClient(CONNECTION_STRING);
  const userData: {
    userId: CommunicationUserIdentifier;
    token: string;
    displayName: string;
  }[] = [];
  for (const displayName of displayNames) {
    const userAndToken = await tokenClient.createUserAndToken(['chat']);
    userData.push({
      userId: userAndToken.user,
      token: userAndToken.token,
      displayName: displayName
    });
  }

  if (!userData[0]) {
    throw new Error('Failed to create user and token');
  }

  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userData[0].token));
  const threadId =
    (
      await chatClient.createChatThread(
        { topic: CHAT_TOPIC_NAME },
        {
          participants: userData.map((item) => ({ id: item.userId, displayName: item.displayName }))
        }
      )
    ).chatThread?.id ?? '';

  return userData.map((data) => ({
    userId: data.userId.communicationUserId,
    token: data.token,
    endpointUrl,
    displayName: data.displayName,
    threadId,
    topic: CHAT_TOPIC_NAME
  }));
};

/**
 * Creates a set of chat test users.
 * To be used in a playwright fixture 'users'.
 */
export const createChatUsers =
  (testParticipants: string[]) =>
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  async ({}, use: (r: ChatUserType[]) => Promise<void>) => {
    const users = await createChatThreadAndUsers(testParticipants);
    await use(users);
  };

const createCallingUserAndToken = async (): Promise<CallUserType> => {
  const tokenClient = new CommunicationIdentityClient(CONNECTION_STRING);
  const user = await tokenClient.createUserAndToken(['voip']);
  return {
    userId: user.user.communicationUserId,
    token: user.token
  };
};

/**
 * Creates a set of call test users.
 * To be used in a playwright fixture 'users'.
 */
export const createCallUsers =
  (testParticipants: string[]) =>
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  async ({}, use: (users: Array<CallUserType>) => Promise<void>) => {
    const groupId = v1();
    const users: Array<CallUserType> = [];
    for (const displayName of testParticipants) {
      const user = await createCallingUserAndToken();
      user.displayName = displayName;
      user.groupId = groupId;
      users.push(user);
    }
    await use(users);
  };

export const createCallWithChatObjectsAndUsers = async (
  displayNames: string[]
): Promise<Array<CallWithChatUserType>> => {
  const callId = v1();
  const endpoint = CONNECTION_STRING.replace('endpoint=', '').split(';')[0];
  if (!endpoint) {
    throw new Error('Endpoint URL not found in connection string');
  }
  const endpointUrl = new URL(endpoint).toString();
  const tokenClient = new CommunicationIdentityClient(CONNECTION_STRING);
  const userData: {
    userId: CommunicationUserIdentifier;
    token: string;
    displayName: string;
  }[] = [];
  for (const displayName of displayNames) {
    const userAndToken = await tokenClient.createUserAndToken(['chat', 'voip']);
    userData.push({
      userId: userAndToken.user,
      token: userAndToken.token,
      displayName: displayName
    });
  }

  if (!userData[0]) {
    throw new Error('Failed to create user and token');
  }

  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userData[0].token));
  const threadId =
    (
      await chatClient.createChatThread(
        { topic: CHAT_TOPIC_NAME },
        {
          participants: userData.map((data) => ({ id: data.userId, displayName: data.displayName }))
        }
      )
    ).chatThread?.id ?? '';

  return userData.map((data) => ({
    userId: data.userId.communicationUserId,
    token: data.token,
    endpointUrl,
    displayName: data.displayName,
    threadId,
    topic: CHAT_TOPIC_NAME,
    groupId: callId
  }));
};

/**
 * Creates a set of call-with-chat test users.
 * To be used in a playwright fixture 'users'.
 */
export const createCallWithChatUsers =
  (testParticipants: string[]) =>
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  async ({}, use: (r: CallWithChatUserType[]) => Promise<void>) => {
    const users = await createCallWithChatObjectsAndUsers(testParticipants);
    await use(users);
  };

/**
 * Load a URL in the browser page.
 * @param browser Browser to create Page in.
 * @param url URL to a running test app.
 * @returns
 */
export const loadNewPage = async (browser: Browser, url?: string): Promise<Page> => {
  const page = await browser.newPage();
  bindConsoleErrorForwarding(page);
  if (url) {
    await page.goto(url);
  }
  return page;
};

/**
 * Load a URL in a new Page in the browser with permissions needed for the CallComposite.
 * @param browser Browser to create Page in.
 * @param url URL to a running test app.
 * @returns
 */
export const loadNewPageWithPermissionsForCalls = async (browser: Browser, url?: string): Promise<Page> => {
  const context = await browser.newContext({ permissions: ['notifications', 'camera', 'microphone'] });
  const page = await context.newPage();
  bindConsoleErrorForwarding(page);
  if (url) {
    await page.goto(url);
  }
  return page;
};
