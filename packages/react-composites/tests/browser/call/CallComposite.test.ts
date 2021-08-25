// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { waitForCallCompositeToLoad, dataUiId, disableAnimation } from '../utils';
import { test } from './fixture';
import { expect, Page } from '@playwright/test';

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
  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await waitForCallCompositeToLoad(pages[idx]);
      await pages[idx].waitForSelector(dataUiId('call-composite-device-settings'));
      await pages[idx].waitForSelector(dataUiId('call-composite-local-preview'));
      await pages[idx].waitForSelector(`${dataUiId('call-composite-start-call-button')}[data-is-focusable="true"]`);
      await stubLocalCameraName(pages[idx]);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-call-screen.png`, { threshold: 0.5 });
    }
  });

  test('local device settings can toggle camera & audio', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      await stubLocalCameraName(page);
      await page.waitForSelector(dataUiId('call-composite-device-settings'));
      await page.waitForSelector(dataUiId('call-composite-local-preview'));
      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-local-device-settings-camera-disabled.png`);
      await page.click(dataUiId('call-composite-local-device-settings-microphone-button'));
      await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
      await page.waitForSelector('video');
      await page.waitForTimeout(1000);
      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-local-device-settings-camera-enabled.png`);
    }
  });
});

test.describe('Call Composite E2E CallScreen Tests', () => {
  // Make sure tests can still run well after retries
  test.beforeEach(async ({ pages }) => {
    // In case it is retry logic
    for (const page of pages) {
      page.reload();
      page.bringToFront();
      await waitForCallCompositeToLoad(page);

      await page.waitForSelector(dataUiId('call-composite-start-call-button'));
      await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
      await page.click(dataUiId('call-composite-start-call-button'));
    }

    for (const page of pages) {
      await page.waitForFunction(() => {
        return document.querySelectorAll('video').length === 2;
      });
    }
  });

  test('video gallery renders for all pages', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      page.bringToFront();

      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-video-gallery.png`);
    }
  });

  test('participant list loads correctly', async ({ pages }) => {
    // TODO: Remove this function when we fix unstable contextual menu bug
    // Bug link: https://skype.visualstudio.com/SPOOL/_workitems/edit/2558377/?triage=true
    await turnOffAllVideos(pages);

    for (const idx in pages) {
      const page = pages[idx];
      page.bringToFront();

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

    page.bringToFront();
    await page.click(dataUiId('call-composite-camera-button'));
    await page.waitForFunction(() => {
      return document.querySelectorAll('video').length === 1;
    });
    expect(await page.screenshot()).toMatchSnapshot(`camera-toggled.png`);
  });
});

const turnOffAllVideos = async (pages: Page[]): Promise<void> => {
  for (const page of pages) {
    page.click(dataUiId('call-composite-camera-button'));
  }
  for (const page of pages) {
    page.bringToFront();
    await page.waitForFunction(() => {
      return document.querySelectorAll('video').length === 0;
    });
  }
};
