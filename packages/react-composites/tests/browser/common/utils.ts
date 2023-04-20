// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './constants';
import { ElementHandle, JSHandle, Locator, Page, PageScreenshotOptions, TestInfo } from '@playwright/test';
import { ChatUserType, CallUserType, CallWithChatUserType } from './fixtureTypes';
import { v1 as generateGUID } from 'uuid';

// This timeout must be less than the global timeout
const PER_STEP_TIMEOUT_MS = 5000;

export function perStepLocalTimeout(): number {
  if (process.env.LOCAL_DEBUG) {
    // Disable per-step timeouts for local debugging
    // so that developers can use the playwright inspector
    // to single step through the playwright test.
    return 0;
  }
  return PER_STEP_TIMEOUT_MS;
}

/** Selector string to get element by data-ui-id property */
export const dataUiId = (id: string): string => `[data-ui-id="${id}"]`;

/**
 * Wrapper function to take a screenshot if the provided callback fails.
 */
export async function screenshotOnFailure<T>(page: Page, fn: () => Promise<T>): Promise<T> {
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
  await screenshotOnFailure(page, async () => await page.click(selector, { timeout: perStepLocalTimeout() }));
  // Move the mouse off the screen
  await page.mouse.move(-1, -1);
};

/**
 * Page wait for selector helper function - USE INSTEAD OF PAGE.WAITFORSELECTOR
 * Using this, when the wait for selector fails, we get a screenshot showing why it failed.
 */
export const waitForSelector = async (
  page: Page,
  selector: string,
  options?: { state?: 'visible' | 'attached'; timeout?: number }
): Promise<ElementHandle<SVGElement | HTMLElement>> => {
  await page.bringToFront();
  return await screenshotOnFailure(
    page,
    async () => await page.waitForSelector(selector, { timeout: perStepLocalTimeout(), ...options })
  );
};

/**
 * Obtain a {@link Locator} for a given selector string and wait for the target element to enter given state.
 *
 * Use this instead of {@link page.locator} because this function takes a screenshot on time.
 * Use this instead of {@link waitForSelector} because locators are the recommended way to obtain element handles:
 *
 * See https://playwright.dev/docs/locators
 */
export async function waitForLocator(
  page: Page,
  selector: string,
  options?: { state?: 'visible' | 'attached'; timeout?: number }
): Promise<Locator> {
  await page.bringToFront();
  const locator = page.locator(selector);
  await screenshotOnFailure(page, async () => await locator.waitFor(options));
  return locator;
}

/**
 * Page wait for function helper function - USE INSTEAD OF PAGE.WAITFORFUNCTION
 * Using this, when the wait for function fails, we get a screenshot showing why it failed.
 */
export async function waitForFunction<R>(
  page: Page,
  pageFunction: PageFunction<R>,
  arg?: unknown,
  options?: { timeout?: number }
): Promise<SmartHandle<R>> {
  return await screenshotOnFailure(
    page,
    async () => await page.waitForFunction(pageFunction, arg, { timeout: perStepLocalTimeout(), ...options })
  );
}

/**
 * Wait for page fonts to have loaded. This is because we sometimes see test failures due to
 * font differences where it looks like the Segoe UI font has not yet loaded.
 */
export const waitForPageFontsLoaded = async (page: Page): Promise<void> => {
  await waitForFunction(page, async () => {
    // typescript libraries in Node define the type of `document` as
    //     interface Document {}
    // this breaks `tsc`, even though it works correctly in the browser.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (document as any).fonts.ready;
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

  // Tests often timeout at this point because call agent creation and device enumeration can take > 5 seconds.
  // Extend the timeout here to trade flakiness for potentially longer test runtime.
  // Test flake has a much larger impact on overall CI time than individual test runtime.
  const startCallButton = await waitForSelector(page, dataUiId('call-composite-start-call-button'), {
    timeout: 2 * perStepLocalTimeout()
  });
  await startCallButton.waitForElementState('enabled');
};

/**
 * Wait for the CallWithChatComposite on a page to fully load.
 */
export const waitForCallWithChatCompositeToLoad = async (page: Page): Promise<void> => {
  // CallWithChatComposite initial page is the same as call composite
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
 * Load composite call page with participant video feeds fully rendered.
 */
export const loadCallPageWithParticipantVideos = async (pages: Page[]): Promise<void> => {
  // Start local camera and start the call
  for (const page of pages) {
    await page.bringToFront();
    await pageClick(page, dataUiId('call-composite-local-device-settings-camera-button'));
    await pageClick(page, dataUiId('call-composite-start-call-button'));
    await waitForSelector(page, dataUiId('call-page'));
  }

  await waitForCallPageParticipantVideos(pages);
};

/**
 * Wait for the Composite CallPage page to fully load with video participant video feeds enabled.
 *
 * @param expectedVideoCount If set, the number of video tiles to expect. Default is `pages.length`.
 */
export const waitForCallPageParticipantVideos = async (pages: Page[], expectedVideoCount?: number): Promise<void> => {
  for (const page of pages) {
    await page.bringToFront();
    await waitForFunction(
      page,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (args: any) => {
        const videoNodes = document.querySelectorAll('video');
        const correctNoOfVideos = videoNodes.length === args.expectedVideoCount;
        const allVideosLoaded = Array.from(videoNodes).every(
          (videoNode) => !!videoNode && videoNode.readyState === 4 && !videoNode.paused
        );
        return correctNoOfVideos && allVideosLoaded;
      },
      {
        expectedVideoCount: expectedVideoCount ?? pages.length
      },
      // The tests often timeout at this step because loading remote video streams can take > 5 seconds.
      // Extend the timeout here to trade flakiness for potentially longer test runtime.
      // Test flake has a much larger impact on overall CI time than individual test runtime.
      //
      // The extended timeout was determined by stress testing on CI.
      { timeout: 10 * perStepLocalTimeout() }
    );
  }
};

/**
 * Wait for PiPiP it's videos to have loaded.
 *
 * By default checks for 2 video tiles in the PiPiP.
 * Set `skipVideoCheck` for hermetic tests because the <HermeticApp /> fakes the video node with a <div/>.
 */
export const waitForPiPiPToHaveLoaded = async (
  page: Page,
  options?: {
    videosEnabledCount?: number;
    skipVideoCheck?: boolean;
  }
): Promise<void> => {
  const { videosEnabledCount = 2, skipVideoCheck = false } = options ?? {};

  await page.bringToFront();
  await waitForFunction(
    page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => {
      // Check pipip is a valid element on screen
      const pipip = document.querySelector<HTMLElement>(args.pipipSelector);
      if (!pipip) {
        return false;
      }

      // Check there are the correct number of tiles inside the pipip
      const tileNodes = pipip.querySelectorAll<HTMLElement>(args.participantTileSelector);
      if (tileNodes.length !== args.expectedTileCount) {
        return false;
      }

      if (args.skipVideoCheck) {
        return true;
      }

      // Check the videos are ready in each tile
      const allVideosLoaded = Array.from(tileNodes).every((tileNode) => {
        const videoNode = tileNode?.querySelector('video');
        return videoNode && videoNode.readyState === 4;
      });
      return allVideosLoaded;
    },
    {
      pipipSelector: dataUiId('picture-in-picture-in-picture-root'),
      participantTileSelector: dataUiId('video-tile'),
      expectedTileCount: videosEnabledCount,
      skipVideoCheck: skipVideoCheck
    }
  );
};

/**
 * Stub out timestamps on the page to avoid spurious diffs in snapshot tests.
 */
export const stubMessageTimestamps = async (page: Page): Promise<void> => {
  const messageTimestampId: string = dataUiId(IDS.messageTimestamp);
  await page.evaluate((messageTimestampId) => {
    Array.from(document.querySelectorAll(messageTimestampId)).forEach((i) => (i.textContent = 'timestamp'));
  }, messageTimestampId);
  // Wait for timestamps to have been updated in the DOM
  await waitForFunction(
    page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => {
      const timestampNodes = Array.from(document.querySelectorAll(args.messageTimestampId));
      return timestampNodes.every((node) => node.textContent === 'timestamp');
    },
    {
      messageTimestampId: messageTimestampId
    }
  );
};

/**
 * Stub out ReadReceipts tooltip content to avoid spurious diffs in snapshot tests.
 */
export const stubReadReceiptsToolTip = async (page: Page): Promise<void> => {
  const readReceiptsToolTipId: string = dataUiId(IDS.readReceiptTooltip) + ' > div > div > p';

  await page.evaluate((readReceiptsToolTipId) => {
    Array.from(document.querySelectorAll(readReceiptsToolTipId)).forEach((i) => (i.textContent = 'Read by stub/stub'));
  }, readReceiptsToolTipId);

  await waitForFunction(
    page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => {
      const readReceiptsTooltipNodes = Array.from(document.querySelectorAll(args.readReceiptsToolTipId));
      return readReceiptsTooltipNodes.every((node) => node.textContent === 'Read by stub/stub');
    },
    {
      readReceiptsToolTipId: readReceiptsToolTipId
    }
  );
};

/**
 * Helper to wait for a number of participants in partipants in page
 * @param page - the page where the participant list element will be queried
 * @param numParticipants - number of participants to wait for
 */
export const waitForParticipants = async (page: Page, numParticipants: number): Promise<void> => {
  const participantListSelector = dataUiId(IDS.participantList);
  await waitForFunction(
    page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => {
      const participantList = document.querySelector(args.participantListSelector) as Element;
      return participantList.children.length === args.numParticipants;
    },
    {
      participantListSelector: participantListSelector,
      numParticipants: numParticipants
    }
  );
};

export const encodeQueryData = (qArgs?: { [key: string]: string }): string => {
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
  user: ChatUserType | CallUserType | CallWithChatUserType,
  qArgs?: { [key: string]: string }
): string => `${serverUrl}?${encodeQueryData({ ...user, ...qArgs })}`;

// Unexported types from @playwright/tests package we need
type PageFunction<R> = string | ((arg: unknown) => R | Promise<R>);
type SmartHandle<T> = T extends Node ? ElementHandle<T> : JSHandle<T>;

/**
 *  Helper function to detect whether a test is for a mobile broswer or not.
 *  TestInfo comes from the playwright config which gives different information about what platform the
 *  test is being run on.
 * */
export const isTestProfileMobile = (testInfo: TestInfo): boolean => !isTestProfileDesktop(testInfo);

/**
 *  Helper function to detect whether a test is for a mobile broswer or not.
 *  TestInfo comes from the playwright config which gives different information about what platform the
 *  test is being run on.
 * */
export const isTestProfileDesktop = (testInfo: TestInfo): boolean => {
  const testName = testInfo.project.name.toLowerCase();
  return testName.includes('desktop') ? true : false;
};

export interface StubOptions {
  /** Stub out all timestamps in the chat message thread. */
  stubMessageTimestamps?: boolean;
  /**
   * Disable tooltips on all buttons in the call control bar.
   *
   * @defaultValue true.
   */
  dismissTooltips?: boolean;
  /** Hide chat message actions icon button. */
  dismissChatMessageActions?: boolean;
  /** wait for file type icon to render. */
  awaitFileTypeIcon?: boolean;
  /**
   * The loading spinner for video tiles can show during live service tests (likely due to network flakiness).
   * This should be removed when tests use a serviceless environment.
   * @defaultValue true
   */
  hideVideoLoadingSpinner?: boolean;
  /**
   * In live tests, video stream quality can vary leading to video quality artifacts in the UI snapshots.
   *
   * Set this flag to mask out the video elements.
   *
   * @defaultValue true
   */
  maskVideos?: boolean;
}

/**
 * A helper to take stable screenshots.
 *
 * USE THIS INSTEAD OF page.screenshot()
 */
export async function stableScreenshot(
  page: Page,
  stubOptions?: StubOptions,
  screenshotOptions?: PageScreenshotOptions
): Promise<Buffer> {
  await waitForPageFontsLoaded(page);
  if (stubOptions?.stubMessageTimestamps) {
    await stubMessageTimestamps(page);
  }
  if (stubOptions?.dismissTooltips !== false) {
    await disableTooltips(page);
  }
  if (stubOptions?.dismissChatMessageActions) {
    await hideChatMessageActionsButton(page);
  }
  if (stubOptions?.hideVideoLoadingSpinner !== false) {
    await hideVideoLoadingSpinner(page);
  }
  if (stubOptions?.awaitFileTypeIcon) {
    await awaitFileTypeIcon(page);
  }
  if (stubOptions?.maskVideos !== false) {
    await maskVideos(page);
  }
  try {
    return await page.screenshot(screenshotOptions);
  } finally {
    if (stubOptions?.dismissTooltips !== false) {
      await enableTooltips(page);
    }
  }
}

/**
 * Helper function for hiding chat message actions icon button.
 */
const hideChatMessageActionsButton = async (page: Page): Promise<void> => {
  await page.addStyleTag({ content: '.ui-chat__message__actions {display: none}' });
};

/**
 * Helper function for disabling all the tooltips on the page.
 * Note: For tooltips to work again, please call `enableTooltips(page)` after the test.
 */
const disableTooltips = async (page: Page): Promise<void> => {
  await page.addStyleTag({ content: '.ms-Tooltip {display: none}' });
};

/**
 * Helper function for enabling all the tooltips on the page.
 */
const enableTooltips = async (page: Page): Promise<void> => {
  await page.addStyleTag({ content: '.ms-Tooltip {display: block}' });
};

const hideVideoLoadingSpinner = async (page: Page): Promise<void> => {
  await page.addStyleTag({ content: '[data-ui-id="stream-media-loading-spinner"] {display: none}' });
};

const MASK_ATTRIB_KEY = 'data-ui-id';
const MASK_ATTRIB_VALUE = 'stream-media-video-mask';
const MASK_SELECTOR = `[${MASK_ATTRIB_KEY}="${MASK_ATTRIB_VALUE}"]`;

/**
 * Masks the video element in {@link VideoTile} by overlaying an opaque <div/>.
 *
 * Pixel-perfect UI snapshots of video frames are impossible -- there are many factors
 * beyond our control (e.g. network bandwidth) that affect the video frames being rendered.
 * This leads to trivial differences in the UI snapshots.
 * As we aren't trying to validate the calling infrastructures ability to render the video, we
 * mask it to get robust UI snapshots.
 *
 * This function is destructive: It changes the video tile's DOM irreversibly.
 * This function is idempotent: It is safe to call this function multiple times.
 */
async function maskVideos(page: Page): Promise<void> {
  await page.bringToFront();
  await page.addStyleTag({ content: `${dataUiId('stream-media-container')} {position: relative}` });

  // Can't use `waitForLocator` because we expect multiple video tiles.
  // Also, it is assumed that the videos have already loaded by the time snapshot is taken.
  const videos = page.locator(dataUiId('stream-media-container'));
  await videos.evaluateAll(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (nodes: HTMLElement[], args: any) => {
      const { mask_key, mask_value } = args;
      nodes.forEach((node) => {
        const children = Array.from(node.children ?? []) as HTMLElement[];
        const masks = children.filter((child) => child.getAttribute(mask_key) === mask_value);
        if (masks.length > 0) {
          // Already have a mask. Nothing to do.
          return;
        }

        const mask = document.createElement('div');
        mask.setAttribute(mask_key, mask_value);
        mask.setAttribute('style', 'position: absolute; height: 100%; width: 100%; background: green;');
        node.appendChild(mask);
      });
    },
    {
      mask_key: MASK_ATTRIB_KEY,
      mask_value: MASK_ATTRIB_VALUE
    }
  );

  // Wait for all masks to have been added to the DOM.
  await waitForFunction(
    page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => {
      const { selector, maskCount } = args;
      return document.querySelectorAll(selector).length === maskCount;
    },
    {
      selector: MASK_SELECTOR,
      maskCount: await videos.evaluateAll((nodes: HTMLElement[]) => nodes.length)
    }
  );
}

/**
 * Helper function for waiting for file type icons. File type icons
 * cannot be registered as they are loaded dynamically based on the
 * type of file being loaded (e.g.- .pdf, .docx, .png, .txt)
 */
const awaitFileTypeIcon = async (page: Page): Promise<void> => {
  const fileTypeIconId: string = dataUiId(IDS.fileTypeIcon);
  await waitForFunction(
    page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => {
      const iconNodes = Array.from(document.querySelectorAll(args.fileTypeIconId));
      return iconNodes.every((node) => node?.querySelector('img').complete);
    },
    {
      fileTypeIconId: fileTypeIconId
    }
  );
};

/**
 * Block for given number of seconds in an async test.
 *
 * This is useful for making a test hang while you're debugging. To stop a test at
 * some point for 5 minutes, simply add:
 *
 * ```
 *   await blockForMinutes(5);
 * ```
 * DO NOT USE in production code because artificial delays like this slow down CI.
 */
export async function blockForMinutes(m: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000 * 60 * m);
  });
}

/**
 * Hides the PiPiP video tile.
 * Useful when testing participant list on mobile devices
 * where the content being tested is hidden behind the PiPiP video tile.
 */
export const hidePiPiP = async (page: Page): Promise<void> => {
  const pipipId = dataUiId('picture-in-picture-in-picture-root');
  await page.evaluate((pipipId) => {
    document.querySelector(pipipId)?.remove();
  }, pipipId);
};

/**
 * Helper function to check if there is an element with a matching selector in the page
 */
export const existsOnPage = async (page: Page, selector: string): Promise<boolean> => {
  try {
    await page.waitForSelector(selector, { timeout: perStepLocalTimeout() });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Helper function to drag element with matching selector in the page to the right by its width
 */
export const dragToRight = async (page: Page, selector: string): Promise<void> => {
  const handle = await screenshotOnFailure(page, async () => await waitForLocator(page, selector));
  const boundingBox = await handle.boundingBox();
  if (!boundingBox) {
    page.screenshot({ path: `test-results/failure-screenshot-${generateGUID()}.png` });
    fail(`Bounding box for selector '${selector}' could not be found.`);
  }
  await screenshotOnFailure(
    page,
    async () =>
      await handle.dragTo(handle, {
        force: true,
        targetPosition: {
          // drag to the right by the entire width of element
          x: boundingBox.width,
          y: 0
        }
      })
  );
};

export const jsonDateReplacer = (key: unknown, value: unknown): unknown => {
  if (key === 'timestamp' && value instanceof Date) {
    return value.getTime();
  }
  return value;
};
