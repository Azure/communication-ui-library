// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';
import { COMPOSITE_LOCALE_EN_US } from '../../../../src';
import { CaptionsCallFeatureState } from '@internal/calling-stateful-client';

const captionsFeatureState: CaptionsCallFeatureState = {
  captions: [
    {
      resultType: 'Final',
      timestamp: new Date(0),
      speaker: {
        displayName: 'Participant 1',
        identifier: { communicationUserId: 'communicationId1', kind: 'communicationUser' }
      },
      spokenLanguage: 'en-us',
      captionText: 'How are you?'
    },
    {
      resultType: 'Final',
      timestamp: new Date(10000),
      speaker: {
        displayName: 'Participant 2',
        identifier: { communicationUserId: 'communicationId2', kind: 'communicationUser' }
      },
      spokenLanguage: 'en-us',
      captionText: 'I am good.'
    },
    {
      resultType: 'Final',
      timestamp: new Date(10000),
      speaker: {
        displayName: 'Participant 3',
        identifier: { communicationUserId: 'communicationId3', kind: 'communicationUser' }
      },
      spokenLanguage: 'en-us',
      captionText: 'Nice to see you today!'
    }
  ],
  supportedSpokenLanguages: Object.keys(COMPOSITE_LOCALE_EN_US.strings.call.captionsAvailableLanguageStrings),
  supportedCaptionLanguages: Object.keys(COMPOSITE_LOCALE_EN_US.strings.call.captionsAvailableLanguageStrings),
  currentCaptionLanguage: 'en-us',
  currentSpokenLanguage: 'en-us',
  isCaptionsFeatureActive: true
};

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

  test('Captions menu shows correct when clicked', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, dataUiId('captions-banner-more-button'));
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

  test('Captions settings triggered by caption banner correctly', async ({ page, serverUrl }) => {
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

test.describe('Captions buttons in call control', () => {
  test('Captions buttons shows when it is teams call', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
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

  test('Captions settings renders normally', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    if (initialState?.call) {
      initialState.isTeamsCall = true;
    }
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-button"]`);
    await pageClick(page, `[id="common-call-composite-captions-settings-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot(`caption-settings.png`);
  });

  test('Captions toggle button changes when caption enabled', async ({ page, serverUrl }) => {
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
});
