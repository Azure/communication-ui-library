// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './config';
import {
  CONNECTION_STRING,
  PAGE_VIEWPORT,
  CHAT_TOPIC_NAME,
  ChatUserType,
  CallUserType,
  MeetingUserType
} from './defaults';
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
  const pages = await Promise.all(
    users.map(async (user) => loadPageWithPermissionsForCalls(testBrowser, serverUrl, user))
  );
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
export const waitForChatCompositeToLoad = async (page: Page): Promise<void> => {
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
  await page.bringToFront();
  await page.waitForLoadState('load');

  await page.waitForFunction(
    (args) => {
      const callButton = document.querySelector(args.startCallButtonSelector);
      const callButtonEnabled = callButton && callButton.ariaDisabled !== 'true';
      return callButtonEnabled;
    },
    { startCallButtonSelector: dataUiId('call-composite-start-call-button') }
  );
};

/**
 * Wait for the MeetingComposite on a page to fully load.
 */
export const waitForMeetingCompositeToLoad = async (page: Page): Promise<void> => {
  // Meeting composite initial page is the same as call composite
  await waitForCallCompositeToLoad(page);
};

/**
 * Wait for the Composite CallScreen page to fully load.
 */
export const loadCallScreen = async (pages: Page[]): Promise<void> => {
  for (const page of pages) {
    await page.bringToFront();
    await page.click(dataUiId('call-composite-start-call-button'));
  }

  // Wait for all participants tiles to have loaded
  for (const page of pages) {
    await page.bringToFront();
    await page.waitForFunction(
      (args) => {
        const tileNodes = document.querySelectorAll(args.participantTileSelector);
        const correctNoOfTiles = tileNodes.length === args.expectedTileCount;
        return correctNoOfTiles;
      },
      { participantTileSelector: dataUiId('video-tile'), expectedTileCount: pages.length }
    );
  }
};

/**
 * Wait for the Composite CallScreen page to fully load with video participant video feeds enabled.
 */
export const loadCallScreenWithParticipantVideos = async (pages: Page[]): Promise<void> => {
  // Start local camera and start the call
  for (const page of pages) {
    await page.bringToFront();
    await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
    await page.click(dataUiId('call-composite-start-call-button'));
  }

  // Wait for all participants cameras to have loaded
  for (const page of pages) {
    await page.bringToFront();
    await page.waitForFunction(
      (args) => {
        const videoNodes = document.querySelectorAll('video');
        const correctNoOfVideos = videoNodes.length === args.expectedVideoCount;
        const allVideosLoaded = Array.from(videoNodes).every((videoNode) => videoNode.readyState === 4);
        return correctNoOfVideos && allVideosLoaded;
      },
      {
        expectedVideoCount: pages.length
      }
    );
  }
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
