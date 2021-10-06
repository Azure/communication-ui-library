// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  waitForCallCompositeToLoad,
  dataUiId,
  disableAnimation,
  loadCallScreenWithParticipantVideos,
  loadUrlInPage
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

test.describe('Call Composite E2E Tests', () => {
  test.beforeEach(async ({ pages, serverUrl, users }) => {
    // Each test *must* join a new call to prevent test flakiness.
    // We hit a Calling SDK service 500 error if we do not.
    // An issue has been filed with the calling team.
    const newTestGuid = generateGUID();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const user = users[i];
      user.groupId = newTestGuid;

      await loadUrlInPage(page, serverUrl, user);
      await waitForCallCompositeToLoad(page);
    }
  });

  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await pages[idx].waitForSelector(dataUiId('call-composite-device-settings'));
      await pages[idx].waitForSelector(dataUiId('call-composite-local-preview'));
      await pages[idx].waitForSelector(`${dataUiId('call-composite-start-call-button')}[data-is-focusable="true"]`);
      await stubLocalCameraName(pages[idx]);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-call-screen.png`);
    }
  });

  test('local device settings can toggle camera & audio', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      await stubLocalCameraName(page);
      await page.waitForSelector(dataUiId('call-composite-device-settings'));
      await page.waitForSelector(dataUiId('call-composite-local-preview'));
      await pages[idx].waitForSelector(`${dataUiId('call-composite-start-call-button')}[data-is-focusable="true"]`);
      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-local-device-settings-camera-disabled.png`);
      await page.click(dataUiId('call-composite-local-device-settings-microphone-button'));
      await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
      await page.waitForFunction(() => {
        const videoNode = document.querySelector('video');
        const videoLoaded = videoNode?.readyState === 4;
        return !!videoNode && videoLoaded;
      });
      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-local-device-settings-camera-enabled.png`);
    }
  });
});

test.describe('Call Composite E2E CallScreen Tests', () => {
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

      await loadUrlInPage(page, serverUrl, user);
      await waitForCallCompositeToLoad(page);
    }

    await loadCallScreenWithParticipantVideos(pages);
  });

  test('video gallery renders for all pages', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      await page.bringToFront();

      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-video-gallery.png`);
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

      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-participants.png`);
    }
  });

  test('can turn off local video', async ({ pages }) => {
    const page = pages[0];

    await page.bringToFront();
    await page.click(dataUiId('call-composite-camera-button'));
    await page.waitForFunction(() => {
      return document.querySelectorAll('video').length === 1;
    });
    expect(await page.screenshot()).toMatchSnapshot(`camera-toggled.png`);
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
    await loadUrlInPage(page, serverUrl, user, {
      showCallDescription: 'true'
    });
    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('call-configuration-page-with-call-details.png');
  });
});

const turnOffAllVideos = async (pages: Page[]): Promise<void> => {
  for (const page of pages) {
    await page.click(dataUiId('call-composite-camera-button'));
  }
  for (const page of pages) {
    await page.bringToFront();
    await page.waitForFunction(() => {
      return document.querySelectorAll('video').length === 0;
    });
  }
};
