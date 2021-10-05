// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './config';
import { ChatClient } from '@azure/communication-chat';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { Browser, Page } from '@playwright/test';
import { ChatUserType } from './defaults';

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
  const startCallButton = await page.waitForSelector(dataUiId('call-composite-start-call-button'));
  await startCallButton.waitForElementState('enabled');
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

/**
 * Stub out timestamps on the page to avoid spurious diffs in snapshot tests.
 */
export const stubMessageTimestamps = (page: Page): void => {
  const messageTimestampId: string = dataUiId(IDS.messageTimestamp);
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
  const qs = encodeQueryData({ ...user, ...qArgs });
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

const encodeQueryData = (qArgs?: { [key: string]: string }): string => {
  const qs: Array<string> = [];
  for (const key in qArgs) {
    qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(qArgs[key]));
  }
  return qs.join('&');
};

/**
 * Create the test URL.
 * @param serverUrl - URL of webpage to test, this is typically https://localhost:3000
 * @param user - Test user the props of which populate query search parameters
 * @param qArgs - Optional args to add to the query search parameters of the URL.
 * @returns URL string
 */
export const buildUrl = (
  serverUrl: string,
  user: ChatUserType | CallUserType | MeetingUserType,
  qArgs?: { [key: string]: string }
): string => `${serverUrl}?${encodeQueryData({ ...user, ...qArgs })}`;
