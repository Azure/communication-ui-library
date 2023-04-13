// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { captionsAvailableLanguageStrings, IDS } from '../../common/constants';

const captionsFeatureState = {
  captions: [
    {
      resultType: 'Final' as const,
      timestamp: new Date(0),
      speaker: {
        displayName: 'Participant 1',
        identifier: { communicationUserId: 'communicationId1', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'en-us' as const,
      captionText: 'How are you?'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10000),
      speaker: {
        displayName: 'Participant 2',
        identifier: { communicationUserId: 'communicationId2', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'en-us',
      captionText: 'I am good.'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10000),
      speaker: {
        displayName: 'Participant 3',
        identifier: { communicationUserId: 'communicationId3', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'en-us',
      captionText: 'Nice to see you today!'
    }
  ],
  supportedSpokenLanguages: captionsAvailableLanguageStrings,
  supportedCaptionLanguages: captionsAvailableLanguageStrings,
  currentCaptionLanguage: 'en-us',
  currentSpokenLanguage: 'en-us',
  isCaptionsFeatureActive: true
};

/* @conditional-compile-remove(close-captions) */
test.describe('Closed Captions Banner tests', async () => {
  test('Show closed captions banner when enabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-captions.png');
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
    expect(await stableScreenshot(page)).toMatchSnapshot('show-menu-on-banner.png');
  });

  test('Hide closed captions banner when disabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = { ...captionsFeatureState, isCaptionsFeatureActive: false };
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('hide-captions-banner.png');
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
    expect(await stableScreenshot(page)).toMatchSnapshot('trigger-settings-from-banner.png');
  });
});

/* @conditional-compile-remove(close-captions) */
test.describe('Captions buttons in call control', () => {
  test('Captions buttons shows when it is teams call', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-button-teams-call.png`);
  });

  test('Captions buttons hides when it is not teams call', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = false;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-button-non-teams-call.png`);
  });

  test.only('Captions settings renders normally', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-button"]`);
    await pageClick(page, `[id="common-call-composite-captions-settings-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-settings.png`);
  });

  test('Captions toggle button renders correctly when caption enabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature.isCaptionsFeatureActive = true;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-toggle-button.png`);
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
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-toggle-button.png`);
  });
});
