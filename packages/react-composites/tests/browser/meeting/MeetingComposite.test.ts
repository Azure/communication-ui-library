// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { waitForCallCompositeToLoad, dataUiId } from '../common/utils';
import { test } from '../common/fixture';
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

test.describe('Meeting Composite E2E Tests', () => {
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
});
