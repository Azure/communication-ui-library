// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('Rooms CallScreen tests for different roles', async () => {
  test('All CallControls are enabled for Presenter', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Presenter' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('rooms-call-screen-presenter.png');
  });

  test('All CallControls are enabled for Attendee', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Attendee' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('rooms-call-screen-attendee.png');
  });

  test('Only few CallControls are enabled for Consumer', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { role: 'Consumer' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('rooms-call-screen-consumer.png');
  });
});
