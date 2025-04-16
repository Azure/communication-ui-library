// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS, captionsFeatureState, realTimeTextFeatureState } from '../../common/constants';

/* @conditional-compile-remove(rtt) */
test.describe('Real Time Text tests', async () => {
  test('Show Real Time Text', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.realTimeTextFeature = realTimeTextFeatureState;
    }

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    //click on expand button if it is mobile
    if (isTestProfileMobile(testInfo)) {
      await pageClick(page, dataUiId('captions-banner-expand-icon'));
    }
    expect(await stableScreenshot(page)).toMatchSnapshot('show-realTimeText.png');
  });

  test('Show Real Time Text With Captions', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.realTimeTextFeature = realTimeTextFeatureState;
      initialState.call.captionsFeature = captionsFeatureState;
    }

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    //click on expand button if it is mobile
    if (isTestProfileMobile(testInfo)) {
      await pageClick(page, dataUiId('captions-banner-expand-icon'));
    }
    expect(await stableScreenshot(page)).toMatchSnapshot('show-realTimeText-caption.png');
  });

  test('Real Time Text buttons shows when it is acs call and connected', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    if (isTestProfileMobile(testInfo)) {
      await page.locator('span:has-text("Real-time text")').scrollIntoViewIfNeeded();
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(`realTimeText-button-call.png`);
  });

  test('Real Time Text Modal renders normally', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-rtt-button"]`);
    await pageClick(page, `[id="common-call-composite-rtt-start-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`realTimeText-modal.png`);
  });

  test('Real Time Text Banner renders normally after start button is clicked', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-rtt-button"]`);
    await pageClick(page, `[id="common-call-composite-rtt-start-button"]`);
    await pageClick(page, dataUiId('realTimeText-modal-confirm-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`realTimeText-banner.png`);
  });

  test('Real Time Text toggle button is disabled when real time text enabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.realTimeTextFeature = realTimeTextFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-rtt-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`rtt-disabled-toggle-button.png`);
  });
});
