// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { expect } from '@playwright/test';
import { buildUrlWithMockAdapter } from './utils';
import { dataUiId, stableScreenshot, waitForSelector } from '../common/utils';
import { IDS } from '../common/constants';

test.describe('CallControls tests', async () => {
  test('CallControls when number of mics drops to zero', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        devices: {
          microphones: []
        }
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('no-mics.png');
  });

  test('CallControls when number of available cameras drops to zero', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        devices: {
          cameras: []
        }
      })
    );
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('no-videos.png');
  });
});
