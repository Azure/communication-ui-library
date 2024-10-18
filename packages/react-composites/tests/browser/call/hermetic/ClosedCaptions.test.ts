// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS, captionsFeatureState, captionsFeatureStateArabic } from '../../common/constants';

test.describe('Closed Captions Banner tests', async () => {
  test('Show loading banner when start captions is clicked but captions is not started yet', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.captionsFeature = {
        ...captionsFeatureState,
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: true
      };
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('captions-loading-banner.png');
  });

  test('Show closed captions banner when enabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-captions.png');
  });

  test('Show RTL languages from right to left', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureStateArabic;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-captions-RTL.png');
  });

  test('Captions menu shows correct when clicked on desktop', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('captions-banner-more-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-menu-on-banner.png');
  });

  test('Hide closed captions banner when disabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.captionsFeature = {
        ...captionsFeatureState,
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: false
      };
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('captions-closed.png');
  });

  test('Captions settings triggered by caption banner correctly on desktop', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('captions-banner-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-settings-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot('trigger-settings-from-banner.png');
  });
});

test.describe('Captions buttons in call control', () => {
  test('Captions buttons shows when it is acs call and connected', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    if (isTestProfileMobile(testInfo)) {
      await page.locator('span:has-text("Live captions")').scrollIntoViewIfNeeded();
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-button-call.png`);
  });

  test('Captions settings renders normally', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-button"]`);
    if (!isTestProfileMobile(testInfo)) {
      await pageClick(page, `[id="common-call-composite-captions-settings-button"]`);
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-settings.png`);
  });

  test('Captions toggle button renders correctly when caption enabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-toggle-button.png`);
  });

  test('Captions toggle button renders correctly when caption disabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.call.captionsFeature.isCaptionsFeatureActive = false;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-toggle-button-disabled.png`);
  });
});
