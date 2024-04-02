// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS, captionsFeatureState, captionsFeatureStateArabic } from '../../common/constants';

/* @conditional-compile-remove(close-captions) */
test.describe('Teams Closed Captions Banner tests', async () => {
  test('Show loading banner when start captions is clicked but captions is not started yet', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = {
        ...captionsFeatureState,
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: true
      };
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('teams-captions-loading-banner.png');
  });

  test('Show closed captions banner when enabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-teams-captions.png');
  });

  test('Show RTL languages from right to left', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = captionsFeatureStateArabic;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-teams-captions-RTL.png');
  });

  test('Captions menu shows correct when clicked on desktop', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('captions-banner-more-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-teams-captions-menu-on-banner.png');
  });

  test('Hide closed captions banner when disabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = {
        ...captionsFeatureState,
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: false
      };
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('teams-captions-closed.png');
  });

  test('Captions settings triggered by caption banner correctly on desktop', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('captions-banner-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-settings-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot('trigger-teams-captions-settings-from-banner.png');
  });
});

/* @conditional-compile-remove(close-captions) */
test.describe('Captions buttons in call control', () => {
  test('Captions buttons shows when it is teams call and connected', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    if (isTestProfileMobile(testInfo)) {
      page.keyboard.press('PageDown');
      page.keyboard.press('PageDown');
      page.keyboard.press('PageDown');
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-button-teams-call.png`);
  });

  test('Captions settings renders normally', async ({ page, serverUrl }, testInfo) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-button"]`);
    if (!isTestProfileMobile(testInfo)) {
      await pageClick(page, `[id="common-call-composite-captions-settings-button"]`);
    }
    expect(await stableScreenshot(page)).toMatchSnapshot(`teams-caption-settings.png`);
  });

  test('Captions toggle button renders correctly when caption enabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`teams-caption-toggle-button.png`);
  });

  test('Captions toggle button renders correctly when caption disabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature.isCaptionsFeatureActive = false;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`teams-caption-toggle-button-disabled.png`);
  });
});
