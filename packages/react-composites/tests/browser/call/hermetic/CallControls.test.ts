// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('CallControls tests', async () => {
  test('CallControls when number of mics drops to zero', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.devices.microphones = [];
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('no-mics.png');
  });

  test('CallControls when number of available cameras drops to zero', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.devices.cameras = [];
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('no-videos.png');
  });
});
