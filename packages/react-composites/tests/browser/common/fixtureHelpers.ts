// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { Browser, Page } from '@playwright/test';
import { v1 } from 'uuid';
import { CHAT_TOPIC_NAME } from './constants';
import { CONNECTION_STRING } from './nodeConstants';
import { ChatUserType, CallUserType, MeetingUserType } from './fixtureTypes';
import { buildUrl } from './utils';

/**
 * Creates a page to be tested for each participant in a browser page.
 * To be used in a playwright fixture's 'pages'.
 */
// eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePagePerParticipant = async ({ serverUrl, users, browser }, use) => {
  const pages = await Promise.all(users.map(async (user) => await loadNewPage(browser, buildUrl(serverUrl, user))));
  await use(pages);
};

/**
 * Creates a page to be tested for each participant in a browser page.
 * To be used in a playwright fixture's 'pages'.
 */
// eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePagePerParticipantWithCallPermissions = async ({ browser, serverUrl, users }, use) => {
  const pages = await Promise.all(
    users.map(async (user) => {
      const page = await loadNewPageWithPermissionsForCalls(browser, buildUrl(serverUrl, user));
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          console.log(`CONSOLE ERROR >> "${msg.text()}"`, msg.args(), msg.location());
        }
      });
      return page;
    })
  );
  await use(pages);
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

const createMeetingObjectsAndUsers = async (displayNames: string[]): Promise<Array<MeetingUserType>> => {
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
    topic: CHAT_TOPIC_NAME,
    groupId: callId
  }));
};

/**
 * Creates a set of meeting test users.
 * To be used in a playwright fixture 'users'.
 */
export const createMeetingUsers =
  (testParticipants: string[]) =>
  // eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  async ({}, use: (r: MeetingUserType[]) => Promise<void>) => {
    const users = await createMeetingObjectsAndUsers(testParticipants);
    await use(users);
  };

/**
 * Load a URL in the browser page.
 * @param browser Browser to create Page in.
 * @param url URL to a running test app.
 * @returns
 */
export const loadNewPage = async (browser: Browser, url: string): Promise<Page> => {
  const page = await browser.newPage();
  await page.goto(url);
  return page;
};

/**
 * Load a URL in a new Page in the browser with permissions needed for the CallComposite.
 * @param browser Browser to create Page in.
 * @param url URL to a running test app.
 * @returns
 */
export const loadNewPageWithPermissionsForCalls = async (browser: Browser, url: string): Promise<Page> => {
  const context = await browser.newContext({ permissions: ['notifications', 'camera', 'microphone'] });
  const page = await context.newPage();
  await page.goto(url);
  return page;
};
