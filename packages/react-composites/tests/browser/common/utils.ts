// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './config';
import { ChatClient } from '@azure/communication-chat';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { Browser, Page } from '@playwright/test';
import { v1 } from 'uuid';

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

  // @TODO
  // We wait 3 sec here to work around flakiness due to timing.
  // It sometimes take a while for the local video / audio streams to load in CI environments.
  // We don't have a good way to know when the composite is fully loaded.
  await page.waitForTimeout(3000);

  // @TODO Add more checks to make sure the composite is fully loaded.
};

const messageTimestampId: string = dataUiId(IDS.messageTimestamp);

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

export type ChatUserType = {
  userId: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
};

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

export type MeetingUserType = {
  userId: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
  groupId?: string;
};

export const createMeetingUsers = async (displayNames: string[]): Promise<Array<MeetingUserType>> => {
  const callId = v1();
  const endpointUrl = new URL(CONNECTION_STRING.replace('endpoint=', '').split(';')[0]).toString();
  const tokenClient = new CommunicationIdentityClient(CONNECTION_STRING);
  const userAndTokens: CommunicationUserToken[] = [];
  for (let i = 0; i < displayNames.length; i++) {
    userAndTokens.push(await tokenClient.createUserAndToken(['chat', 'voip']));
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
    topic: TOPIC_NAME,
    groupId: callId
  }));
};

/**
 * Load a new page in the browser at the supplied url.
 * @param browser Browser to create Page in.
 * @param serverUrl URL to a running test app.
 * @param user User to load url for.
 * @param qArgs Extra query arguments.
 * @returns
 */
export const loadPage = async (
  browser: Browser,
  serverUrl: string,
  user: ChatUserType | CallUserType,
  qArgs?: { [key: string]: string }
): Promise<Page> => await loadUrlInPage(await browser.newPage(), serverUrl, user, qArgs);

/**
 * Load a URL in the browser page.
 * @param browser Browser to create Page in.
 * @param serverUrl URL to a running test app.
 * @param user User to load url for.
 * @param qArgs Extra query arguments.
 * @returns
 */
export const loadUrlInPage = async (
  page: Page,
  serverUrl: string,
  user: ChatUserType | CallUserType,
  qArgs?: { [key: string]: string }
): Promise<Page> => {
  const qs = encodeQueryData(user, qArgs);
  await page.setViewportSize(PAGE_VIEWPORT);
  const url = `${serverUrl}?${qs}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  return page;
};

/**
 * Load a URL in a new Page in the browser with permissions needed for the CallComposite.
 * @param browser Browser to create Page in.
 * @param serverUrl URL to a running test app.
 * @param user User to load ChatComposite for.
 * @param qArgs Extra query arguments.
 * @returns
 */
export const loadPageWithPermissionsForCalls = async (
  browser: Browser,
  serverUrl: string,
  user: CallUserType | MeetingUserType,
  qArgs?: { [key: string]: string }
): Promise<Page> => {
  const context = await browser.newContext({ permissions: ['notifications'] });
  context.grantPermissions(['camera', 'microphone']);
  const page = await context.newPage();
  return await loadUrlInPage(page, serverUrl, user, qArgs);
};

const encodeQueryData = (
  user: ChatUserType | CallUserType | MeetingUserType,
  qArgs?: { [key: string]: string }
): string => {
  const qs: Array<string> = [];
  for (const d in user) {
    qs.push(encodeURIComponent(d) + '=' + encodeURIComponent(user[d]));
  }
  if (qArgs !== undefined) {
    Object.entries(qArgs).forEach(([key, value]) => qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value)));
  }
  return qs.join('&');
};
