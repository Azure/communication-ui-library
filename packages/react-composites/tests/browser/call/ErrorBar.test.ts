// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { expect, Page } from '@playwright/test';
import { buildUrlWithMockAdapter } from './utils';
import { dataUiId, clickOutsideOfPage, waitForPageFontsLoaded, waitForSelector } from '../common/utils';
import { IDS } from '../common/constants';

test.describe('Error bar tests', async () => {
  test('Failure to start video should be shown on error bar', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        latestErrors: {
          'Call.startVideo': {
            timestamp: new Date(),
            name: 'Failure to start video',
            message: 'Could not start video',
            target: 'Call.startVideo',
            innerError: new Error('Inner error of failure to start video')
          }
        }
      })
    );
    // Click off page to turn away initial aria label
    await clickOutsideOfPage(page);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('failure-to-start-video-on-error-bar.png');
  });

  test('Multiple errors should be shown on error bar', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        latestErrors: {
          'Call.unmute': {
            timestamp: new Date(),
            name: 'Failure to unmute',
            message: 'Could not unmute',
            target: 'Call.unmute',
            innerError: new Error('Inner error of failure to unmute')
          },
          'Call.stopVideo': {
            timestamp: new Date(),
            name: 'Failure to stop video',
            message: 'Could not stop video',
            target: 'Call.stopVideo',
            innerError: new Error('Inner error of failure to stop video')
          }
        }
      })
    );
    // Click off page to turn away initial aria label
    await clickOutsideOfPage(page);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('multiple-errors-on-error-bar.png');
    await dismissFirstErrorOnErrorBar(page);
    expect(await page.screenshot()).toMatchSnapshot('one-error-dismissed-on-error-bar.png');
    await dismissFirstErrorOnErrorBar(page);
    expect(await page.screenshot()).toMatchSnapshot('all-errors-dismissed-on-error-bar.png');
  });
});

/**
 * Helper to dismiss first error on ErrorBar in given page
 * @param page - the page where the first error shall be dismissed
 */
const dismissFirstErrorOnErrorBar = async (page: Page): Promise<void> => {
  const errorBarStack = await waitForSelector(page, dataUiId('error-bar-stack'));
  const errorBarFirstButton = await errorBarStack.$('[type="button"]');
  await errorBarFirstButton?.click();
};
