// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  buildUrl,
  dataUiId,
  loadCallPageWithParticipantVideos,
  pageClick,
  waitForCallCompositeToLoad,
  waitForFunction,
  stableScreenshot,
  waitForCallPageParticipantVideos
} from '../../common/utils';
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

      if (!user || !page) {
        throw new Error('Page and user must be defined');
      }

      user.groupId = newTestGuid;

      await page.goto(buildUrl(serverUrl, user));
      await waitForCallCompositeToLoad(page);
    }
  });

  // This is a smoke live test for configuration screen.
  //
  // Updating local video streams before joinging a call is a non-trivial operation.
  // TODO(prprabhu) Rename this test once metrics show that it has been stabilized.
  test('local device settings can toggle camera & audio', async ({ page }) => {
    await pageClick(page, dataUiId('call-composite-local-device-settings-microphone-button'));
    await pageClick(page, dataUiId('call-composite-local-device-settings-camera-button'));
    await waitForFunction(page, () => {
      const videoNode = document.querySelector<HTMLVideoElement>(`video`);
      return !!videoNode && videoNode.readyState === 4 && !videoNode.paused && videoNode;
    });
    await stubLocalCameraName(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-configuration-page-camera-enabled.png`);
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

      if (!user || !page) {
        throw new Error('Page and user must be defined');
      }

      user.groupId = newTestGuid;

      await page.goto(buildUrl(serverUrl, user));
      await waitForCallCompositeToLoad(page);
    }

    await loadCallPageWithParticipantVideos(pages);
  });

  // This is a live smoke test.
  // Rendering and un-rendering video streams involves complex logic spread across
  // the UI components, bindings and the headless SDK layers.
  //
  // Neither unit-tests nor hemertic tests can provide adequate coverage for this flow.
  //
  // This test capture mulitple snapshots / asserts multiple conditions to minimize the number of live tests
  // and hence the flakiness introduced in CI due to dependence on live services.
  //
  // TODO(prprabhu) Rename this test to better reflect the intent once metrics show that this test is stable.
  test('can turn off local video', async ({ pages, page: page0 }) => {
    // First, ensure all pages' videos load correctly.
    for (const [idx, page] of pages.entries()) {
      await page.bringToFront();
      expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-page-${idx}.png`);
    }

    // Then turn off video and check again.
    await pageClick(page0, dataUiId('call-composite-camera-button'));

    // We turned off 1 video.
    await waitForCallPageParticipantVideos(pages, pages.length - 1);

    for (const [idx, page] of pages.entries()) {
      await page.bringToFront();
      expect(await stableScreenshot(page)).toMatchSnapshot(`video-gallery-camera-off-page-${idx}.png`);
    }
  });
});
