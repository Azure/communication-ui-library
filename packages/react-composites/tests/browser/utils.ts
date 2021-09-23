// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './config';
import { CONNECTION_STRING, PAGE_VIEWPORT, CHAT_TOPIC_NAME, ChatUserType } from './defaults';
import { ChatClient } from '@azure/communication-chat';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { Browser, Page } from '@playwright/test';
import { v1 } from 'uuid';

/** Helper function to generate the selector for selecting an HTML node by data-ui-id */
export const dataUiId = (v: string): string => `[data-ui-id="${v}"]`;

/**
 * Creates a page to be tested for each participant in a browser page.
 * To be used in a playwright fixture's 'pages'.
 */
// eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePagePerParticipant = async ({ serverUrl, testBrowser, users }, use) => {
  const pages = await Promise.all(users.map(async (user) => loadPage(testBrowser, serverUrl, user)));
  await use(pages);
};

/**
 * Creates a page to be tested for each participant in a browser page.
 * To be used in a playwright fixture's 'pages'.
 */
// eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePagePerParticipantWithCallPermissions = async ({ serverUrl, testBrowser, users }, use) => {
  const pages = await Promise.all(users.map(async (user) => loadCallCompositePage(testBrowser, serverUrl, user)));
  await use(pages);
};

export const createTestServer =
  (startServer: () => Promise<void>, stopServer: () => Promise<void>, serverUrl: string) =>
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  async ({}, use: (r: string) => Promise<void>) => {
    await startServer();
    try {
      await use(serverUrl);
    } finally {
      await stopServer();
    }
  };

/**
 * Wait for the ChatComposite on a page to fully load.
 */
export const waitForCompositeToLoad = async (page: Page): Promise<void> => {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector(dataUiId(IDS.sendboxTextfield));

  // @TODO
  // We wait 3 sec here to work around a bug.
  // If page[0] sends a message to page[1] as soon as the composite is loaded
  // in the DOM, page[1] doesn't receive the message.
  // Only when page[1] is refreshed is when it will see the message sent by p[1]
  // By waiting 3 sec before sending a message, page[1] is able to recieve that message.
  await page.waitForTimeout(3000);
};

/**
 * Wait for the CallComposite on a page to fully load.
 */
export const waitForCallCompositeToLoad = async (page: Page): Promise<void> => {
  await page.waitForLoadState('load');

  // @TODO Add more checks to make sure the composite is fully loaded.
};

/**
 * Stub out timestamps on the page to avoid spurious diffs in snapshot tests.
 */
export const stubMessageTimestamps = (page: Page): void => {
  page.evaluate((messageTimestampId) => {
    Array.from(document.querySelectorAll(messageTimestampId)).forEach((i) => (i.innerHTML = 'timestamp'));
  }, messageTimestampId);
};

export const disableAnimation = async (page: Page): Promise<void> => {
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        transition: none !important;
        animation: none !important;
      }
    `
  });
};

const messageTimestampId: string = dataUiId(IDS.messageTimestamp);

export const createChatThreadAndUsers = async (displayNames: string[]): Promise<Array<ChatUserType>> => {
  const endpointUrl = new URL(CONNECTION_STRING.replace('endpoint=', '').split(';')[0]).toString();
  const tokenClient = new CommunicationIdentityClient(CONNECTION_STRING);
  const userAndTokens: CommunicationUserToken[] = [];
  for (let i = 0; i < displayNames.length; i++) {
    userAndTokens.push(await tokenClient.createUserAndToken(['chat']));
  }

  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAndTokens[0].token));
  const threadId =
    (
      await chatClient.createChatThread(
        { topic: CHAT_TOPIC_NAME },
        {
          participants: displayNames.map((displayName, i) => ({ id: userAndTokens[i].user, displayName: displayName }))
        }
      )
    ).chatThread?.id ?? '';

  return displayNames.map((displayName, i) => ({
    userId: userAndTokens[i].user.communicationUserId,
    token: userAndTokens[i].token,
    endpointUrl,
    displayName,
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

export type CallUserType = {
  userId: string;
  token: string;
  displayName?: string;
  groupId?: string;
};

/**
 * Creates a set of call test users.
 * To be used in a playwright fixture 'users'.
 */
export const createCallUsers =
  (testParticipants: string[]) =>
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  async ({}, use) => {
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

export const createCallingUserAndToken = async (): Promise<CallUserType> => {
  const tokenClient = new CommunicationIdentityClient(CONNECTION_STRING);
  const user = await tokenClient.createUserAndToken(['voip']);
  return {
    userId: user.user.communicationUserId,
    token: user.token
  };
};

// eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const createTestPages = async ({ serverUrl, testBrowser, users }, use) => {
  const pages = await Promise.all(users.map(async (user) => loadPage(testBrowser, serverUrl, user)));
  await use(pages);
};

/**
 * Load a Page with ChatComposite app.
 * @param browser Browser to create Page in.
 * @param serverUrl URL to a running test app.
 * @param user IdentityType for the user to load ChatComposite for.
 * @param qArgs Extra quary arguments.
 * @returns
 */
export const loadPage = async (
  browser: Browser,
  serverUrl: string,
  user: ChatUserType,
  qArgs?: { [key: string]: string }
): Promise<Page> => {
  const qs = encodeQueryData(user, qArgs);
  const page = await browser.newPage();
  await page.setViewportSize(PAGE_VIEWPORT);
  const url = `${serverUrl}?${qs}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  // Important: For ensuring that blinking cursor doesn't get captured in
  // snapshots and cause a diff in subsequent tests.
  await page.addStyleTag({ content: `* { caret-color: transparent !important; }` });
  return page;
};

/**
 * Load a Page with ChatComposite app.
 * @param browser Browser to create Page in.
 * @param serverUrl URL to a running test app.
 * @param user IdentityType for the user to load ChatComposite for.
 * @param qArgs Extra quary arguments.
 * @returns
 */
export const gotoPage = async (
  page: Page,
  serverUrl: string,
  user: ChatUserType,
  qArgs?: { [key: string]: string }
): Promise<Page> => {
  const qs = encodeQueryData(user, qArgs);
  await page.setViewportSize(PAGE_VIEWPORT);
  const url = `${serverUrl}?${qs}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  // Important: For ensuring that blinking cursor doesn't get captured in
  // snapshots and cause a diff in subsequent tests.
  page.addStyleTag({ content: `* { caret-color: transparent !important; }` });
  return page;
};

/**
 * Load a Page with CallComposite app.
 * @param browser Browser to create Page in.
 * @param serverUrl URL to a running test app.
 * @param user CallUserType for the user to load ChatComposite for.
 * @param qArgs Extra quary arguments.
 * @returns
 */
export const loadCallCompositePage = async (
  browser: Browser,
  serverUrl: string,
  user: CallUserType,
  qArgs?: { [key: string]: string }
): Promise<Page> => {
  const context = await browser.newContext({ permissions: ['notifications'] });
  context.grantPermissions(['camera', 'microphone']);
  const qs = encodeQueryData(user, qArgs);
  const page = await context.newPage();
  await page.setViewportSize(PAGE_VIEWPORT);
  const url = `${serverUrl}?${qs}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  return page;
};

const encodeQueryData = (user: ChatUserType | CallUserType, qArgs?: { [key: string]: string }): string => {
  const qs: Array<string> = [];
  for (const d in user) {
    qs.push(encodeURIComponent(d) + '=' + encodeURIComponent(user[d]));
  }
  if (qArgs !== undefined) {
    Object.entries(qArgs).forEach(([key, value]) => qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value)));
  }
  return qs.join('&');
};
