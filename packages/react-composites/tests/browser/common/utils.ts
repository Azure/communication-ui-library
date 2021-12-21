// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './constants';
import { ElementHandle, JSHandle, Page } from '@playwright/test';
import { ChatUserType, CallUserType, MeetingUserType } from './fixtureTypes';
import { v1 as generateGUID } from 'uuid';

// This timeout must be less than the global timeout
export const PER_STEP_TIMEOUT_MS = 5000;

/** Selector string to get element by data-ui-id property */
export const dataUiId = (id: string): string => `[data-ui-id="${id}"]`;

async function screenshotOnFailure<T>(page: Page, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    await page.screenshot({ path: `test-results/failure-screenshot-${generateGUID()}.png` });
    throw e;
  }
}

/**
 * Page click helper function - USE INSTEAD OF PAGE.CLICK
 *
 * This functions clicks the elements then moves the mouse away to prevent
 * hover behavior appearing non-deterministically in snapshots.
 * Examples of this are tooltips for control bar buttons would show, as well
 * as buttons would show their onHover state.
 *
 * This function will also take a screenshot if the page.click fails for any reason.
 */
export const pageClick = async (page: Page, selector: string): Promise<void> => {
  await page.bringToFront();
  await screenshotOnFailure(page, async () => await page.click(selector, { timeout: PER_STEP_TIMEOUT_MS }));

  // Move the mouse off the screen
  await page.mouse.move(-1, -1);
};

/**
 * Page wait for selector helper function - USE INSTEAD OF PAGE.WAITFORSELECTOR
 * Using this, when the wait for selector fails, we get a screenshot showing why it failed.
 */
export const waitForSelector = async (
  page: Page,
  selector: string
): Promise<ElementHandle<SVGElement | HTMLElement>> => {
  await page.bringToFront();
  return await screenshotOnFailure(
    page,
    async () => await page.waitForSelector(selector, { timeout: PER_STEP_TIMEOUT_MS })
  );
};

/**
 * Page wait for function helper function - USE INSTEAD OF PAGE.WAITFORFUNCTION
 * Using this, when the wait for function fails, we get a screenshot showing why it failed.
 */
export async function waitForFunction<R>(
  page: Page,
  pageFunction: PageFunction<R>,
  arg?: unknown
): Promise<SmartHandle<R>> {
  return await screenshotOnFailure(
    page,
    async () => await page.waitForFunction(pageFunction, arg, { timeout: PER_STEP_TIMEOUT_MS })
  );
}

/**
 * Wait for page fonts to have loaded. This is because we sometimes see test failures due to
 * font differences where it looks like the Segoe UI font has not yet loaded.
 */
const waitForPageFontsLoaded = async (page: Page): Promise<void> => {
  await waitForFunction(page, async () => {
    await document.fonts.ready;
  });
};

/**
 * Wait for the ChatComposite on a page to fully load.
 */
export const waitForChatCompositeToLoad = async (page: Page): Promise<void> => {
  await page.bringToFront();
  await page.waitForLoadState('networkidle');
  await waitForPageFontsLoaded(page);
  await waitForSelector(page, dataUiId(IDS.sendboxTextField));

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
  await waitForPageFontsLoaded(page);
  const startCallButton = await waitForSelector(page, dataUiId('call-composite-start-call-button'));
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
    await pageClick(page, dataUiId('call-composite-start-call-button'));

    // Wait for call page to load (i.e. wait for connecting screen to have passed)
    await waitForSelector(page, dataUiId('call-page'));
  }

  // Wait for all participants tiles to have loaded
  for (const page of pages) {
    await page.bringToFront();
    await waitForFunction(
      page,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (args: any) => {
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
    await pageClick(page, dataUiId('call-composite-local-device-settings-camera-button'));
    await pageClick(page, dataUiId('call-composite-start-call-button'));

    // Wait for call page to load (i.e. wait for connecting screen to have passed)
    await waitForSelector(page, dataUiId('call-page'));
  }

  // Wait for all participants cameras to have loaded
  for (const page of pages) {
    await page.bringToFront();
    await waitForFunction(
      page,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (args: any) => {
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

// Unexported types from @playwright/tests package we need
type PageFunction<R> = string | ((arg: unknown) => R | Promise<R>);
type SmartHandle<T> = T extends Node ? ElementHandle<T> : JSHandle<T>;
