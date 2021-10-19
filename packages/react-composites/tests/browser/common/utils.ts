// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './constants';
import { Page } from '@playwright/test';
import { ChatUserType, CallUserType, MeetingUserType } from './fixtureTypes';

/** Selector string to get element by data-ui-id property */
export const dataUiId = (id: string): string => `[data-ui-id="${id}"]`;

/**
 * Wait for the ChatComposite on a page to fully load.
 */
export const waitForChatCompositeToLoad = async (page: Page): Promise<void> => {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector(dataUiId(IDS.sendboxTextField));

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
 * Wait for the Composite CallPage page to fully load.
 */
export const loadCallPage = async (pages: Page[]): Promise<void> => {
  for (const page of pages) {
    await page.bringToFront();
    await page.click(dataUiId('call-composite-start-call-button'));

    // Wait for call page to load (i.e. wait for connecting screen to have passed)
    await page.waitForSelector(dataUiId('call-page'));
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
 * Wait for the Composite CallPage page to fully load with video participant video feeds enabled.
 */
export const loadCallPageWithParticipantVideos = async (pages: Page[]): Promise<void> => {
  // Start local camera and start the call
  for (const page of pages) {
    await page.bringToFront();
    await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
    await page.click(dataUiId('call-composite-start-call-button'));

    // Wait for call page to load (i.e. wait for connecting screen to have passed)
    await page.waitForSelector(dataUiId('call-page'));
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
export const stubMessageTimestamps = async (page: Page): Promise<void> => {
  const messageTimestampId: string = dataUiId(IDS.messageTimestamp);
  await page.evaluate((messageTimestampId) => {
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
