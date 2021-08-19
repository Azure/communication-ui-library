// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './config';
import { ChatClient } from '@azure/communication-chat';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { Browser, Page } from '@playwright/test';

export const dataUiId = (v: string): string => `[${DATA_UI_ID}="${v}"]`;
const DATA_UI_ID = 'data-ui-id';
const CONNECTION_STRING = process.env.CONNECTION_STRING ?? '';
export const PAGE_VIEWPORT = {
  width: 1024,
  height: 768
};
export const TOPIC_NAME = 'Cowabunga';

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

const messageTimestampId: string = dataUiId(IDS.messageTimestamp);

export type IdentityType = {
  userId: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
};

export const createChatThreadAndUsers = async (displayNames: string[]): Promise<Array<IdentityType>> => {
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
        { topic: TOPIC_NAME },
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
    topic: TOPIC_NAME
  }));
};

export type CallUserType = {
  userId: string;
  token: string;
  displayName?: string;
  groupId?: string;
};

export const createCallingUserAndToken = async (): Promise<CallUserType> => {
  const tokenClient = new CommunicationIdentityClient(CONNECTION_STRING);
  const user = await tokenClient.createUserAndToken(['voip']);
  return {
    userId: user.user.communicationUserId,
    token: user.token
  };
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
  user: IdentityType,
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
  user: IdentityType,
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

const encodeQueryData = (user: IdentityType | CallUserType, qArgs?: { [key: string]: string }): string => {
  const qs: Array<string> = [];
  for (const d in user) {
    qs.push(encodeURIComponent(d) + '=' + encodeURIComponent(user[d]));
  }
  if (qArgs !== undefined) {
    Object.entries(qArgs).forEach(([key, value]) => qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value)));
  }
  return qs.join('&');
};
