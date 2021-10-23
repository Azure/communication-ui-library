// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  buildUrl,
  dataUiId,
  disableAnimation,
  loadCallPageWithParticipantVideos,
  waitForCallCompositeToLoad
} from '../common/utils';
import { test } from './fixture';
import { expect, Page } from '@playwright/test';
import { v1 as generateGUID } from 'uuid';

/**
 * Since we are providing a .y4m video to act as a fake video stream, chrome
 * uses it's file path as the camera name. This file location can differ on
 * every device causing a diff error in test screenshot comparisons.
 * To avoid this error, we replace the unique file path with a custom string.
 */
const stubLocalCameraName = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const element = document.querySelector('[data-ui-id="call-composite-local-camera-settings"]');
    if (element) {
      element.innerHTML = element.innerHTML.replace(/C:.*?y4m/g, 'Fake Camera');
    }
  });
};

test.describe('Call Composite E2E Configuration Screen Tests', () => {
  test.beforeEach(async ({ pages, serverUrl, users }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(buildUrl(serverUrl, user));
      await waitForCallCompositeToLoad(page);
    }
  });

  test('composite pages load completely', async ({ pages }) => {
    const page = pages[0];
    await stubLocalCameraName(page);
    expect(await page.screenshot()).toMatchSnapshot(`call-configuration-page.png`);
  });

  test('local device settings can toggle camera & audio', async ({ pages }) => {
    const page = pages[0];
    await page.click(dataUiId('call-composite-local-device-settings-microphone-button'));
    await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
    await page.waitForFunction(() => {
      const videoNode = document.querySelector('video');
      const videoLoaded = videoNode?.readyState === 4;
      return !!videoNode && videoLoaded;
    });
    await stubLocalCameraName(page);
    expect(await page.screenshot()).toMatchSnapshot(`call-configuration-page-camera-enabled.png`);
  });

  test('Configuration screen should display call details', async ({ serverUrl, users, pages }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    const user = users[0];
    user.groupId = newTestGuid;

    // Set description to be shown
    const page = pages[0];
    await page.goto(
      buildUrl(serverUrl, user, {
        showCallDescription: 'true'
      })
    );
    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('call-configuration-page-with-call-details.png');
  });
});

test.describe('Call Composite E2E CallPage Tests', () => {
  // Make sure tests can still run well after retries
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(buildUrl(serverUrl, user));
      await waitForCallCompositeToLoad(page);
    }

    await loadCallPageWithParticipantVideos(pages);
  });

  test('video gallery renders for all pages', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      await page.bringToFront();

      expect(await page.screenshot()).toMatchSnapshot(`video-gallery-page-${idx}.png`);
    }
  });

  test('participant list loads correctly', async ({ pages }) => {
    // TODO: Remove this function when we fix unstable contextual menu bug
    // Bug link: https://skype.visualstudio.com/SPOOL/_workitems/edit/2558377/?triage=true
    await turnOffAllVideos(pages);

    for (const idx in pages) {
      const page = pages[idx];
      await page.bringToFront();

      // waitForElementState('stable') is not working for opacity animation https://github.com/microsoft/playwright/issues/4055#issuecomment-777697079
      // this is for disable transition/animation of participant list
      await disableAnimation(page);

      await page.click(dataUiId('call-composite-participants-button'));
      const buttonCallOut = await page.waitForSelector('.ms-Callout');
      // This will ensure no animation is happening for the callout
      await buttonCallOut.waitForElementState('stable');

      expect(await page.screenshot()).toMatchSnapshot(`video-gallery-page-participants-flyout-${idx}.png`);
    }
  });

  test('can turn off local video', async ({ pages }) => {
    const page = pages[0];

    await page.bringToFront();
    await page.click(dataUiId('call-composite-camera-button'));
    await page.waitForFunction(() => {
      return document.querySelectorAll('video').length === 1;
    });
    expect(await page.screenshot()).toMatchSnapshot(`video-gallery-page-camera-toggled.png`);
  });
});

test.describe('Call composite participant menu items injection tests', () => {
  // Make sure tests can still run well after retries
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await page.goto(
        buildUrl(serverUrl, user, {
          injectParticipantMenuItems: 'true'
        })
      );
      await waitForCallCompositeToLoad(page);
    }

    await loadCallPageWithParticipantVideos(pages);
  });

  test('injected menu items appear', async ({ pages }) => {
    // TODO: Remove this function when we fix unstable contextual menu bug
    // Bug link: https://skype.visualstudio.com/SPOOL/_workitems/edit/2558377/?triage=true
    await turnOffAllVideos(pages, PER_STEP_TIMEOUT_MS);

    const page = pages[0];
    await page.bringToFront();

    // waitForElementState('stable') does not work for opacity animation https://github.com/microsoft/playwright/issues/4055#issuecomment-777697079
    // this is for disable transition/animation of participant list
    await disableAnimation(page);

    // Open participants flyout.
    await page.click(dataUiId('call-composite-participants-button'), { timeout: PER_STEP_TIMEOUT_MS });
    // Open participant list flyout
    await page.click(dataUiId('participants-button-participants-list'), { timeout: PER_STEP_TIMEOUT_MS });
    // There shouldbe at least one participant. Just click on the first.
    await page.click(dataUiId('participants-list-participant-item') + ' >> nth=0', {
      timeout: PER_STEP_TIMEOUT_MS
    });

    const injectedMenuItem = await page.waitForSelector(dataUiId('test-app-participant-menu-item'), {
      timeout: PER_STEP_TIMEOUT_MS
    });
    await injectedMenuItem.waitForElementState('stable', { timeout: PER_STEP_TIMEOUT_MS });

    expect(await page.screenshot()).toMatchSnapshot(`participant-menu-item-flyout.png`);
  });
});

// `timeout` is applied to each individual step that waits for a condition.
const turnOffAllVideos = async (pages: Page[], timeout?: number): Promise<void> => {
  const options = timeout ? { timeout } : undefined;
  for (const page of pages) {
    await page.click(dataUiId('call-composite-camera-button'), options);
  }
  for (const page of pages) {
    await page.bringToFront();
    await page.waitForFunction(() => {
      return document.querySelectorAll('video').length === 0;
    }, options);
  }
};

const PER_STEP_TIMEOUT_MS = 300;
