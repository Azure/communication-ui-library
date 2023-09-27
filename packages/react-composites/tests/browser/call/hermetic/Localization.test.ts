// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { waitForCallCompositeToLoad, stableScreenshot, waitForSelector, dataUiId } from '../../common/utils';
import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { exec } from 'node:child_process';

test.describe('Localization tests', async () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    exec('free -m', (err, output) => {
      // once the command has completed, the callback function is called
      if (err) {
        // log and return if we encounter an error
        console.error('could not execute command: ', err);
        return;
      }
      // log the output received from the command
      console.log(`RAM during test ${JSON.stringify(testInfo.title)}: \n`, output);
    });
  });
  test('Configuration page title and participant button in call should be localized', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'configuration';
    initialState.call = undefined;
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { useFrLocale: 'true' }));
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('localized-call-configuration-page.png');
  });

  test('Participant button in call should be localized', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { useFrLocale: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('localized-call-screen.png');
  });
});
