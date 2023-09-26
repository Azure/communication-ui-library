// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect, Page } from '@playwright/test';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';
import { exec } from 'node:child_process';

test.describe('Error bar tests', async () => {
  test.beforeEach(async () => {
    await new Promise((r) => setTimeout(r, 2000));
    exec('free -m', (err, output) => {
      // once the command has completed, the callback function is called
      if (err) {
        // log and return if we encounter an error
        console.error('could not execute command: ', err);
        return;
      }
      // log the output received from the command
      console.log('RAM STATUS: \n', output);
    });
  });
  test('Failure to start video should be shown on error bar', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.latestErrors = {
      'Call.startVideo': {
        // Add 24 hours to current time to ensure the error is not dismissed by default
        timestamp: new Date(Date.now() + 3600 * 1000 * 24),
        name: 'Failure to start video',
        message: 'Could not start video',
        target: 'Call.startVideo',
        innerError: new Error('Inner error of failure to start video')
      }
    };
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('failure-to-start-video-on-error-bar.png');
  });

  test('Multiple errors should be shown on error bar', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.latestErrors = {
      'Call.unmute': {
        timestamp: new Date(0),
        name: 'Failure to unmute',
        message: 'Could not unmute',
        target: 'Call.unmute',
        innerError: new Error('Inner error of failure to unmute')
      },
      'Call.stopVideo': {
        timestamp: new Date(1),
        name: 'Failure to stop video',
        message: 'Could not stop video',
        target: 'Call.stopVideo',
        innerError: new Error('Inner error of failure to stop video')
      }
    };
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('multiple-errors-on-error-bar.png');
    await dismissFirstErrorOnErrorBar(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('one-error-dismissed-on-error-bar.png');
    await dismissFirstErrorOnErrorBar(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('all-errors-dismissed-on-error-bar.png');
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
