// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { loadCallPage, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS, captionsFeatureState, captionsFeatureStateArabic } from '../../common/constants';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';

test.describe('Closed Captions Banner tests', async () => {
  test('Show loading banner when start captions is clicked but captions is not started yet', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.call.captionsFeature = {
        ...captionsFeatureState,
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: true
      };
    }
    await loadCallPage(page, serverUrl, initialState);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('captions-loading-banner.png');
  });

  test('Show closed captions banner when enabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await loadCallPage(page, serverUrl, initialState);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-captions.png');
  });

  test('Show RTL languages from right to left', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureStateArabic;
    }
    await loadCallPage(page, serverUrl, initialState);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-captions-RTL.png');
  });

  test('Captions menu shows correct when clicked on desktop', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await loadCallPage(page, serverUrl, initialState);
    await pageClick(page, dataUiId('captions-banner-more-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-menu-on-banner.png');
  });

  test('Hide closed captions banner when disabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.call.captionsFeature = {
        ...captionsFeatureState,
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: false
      };
    }
    await loadCallPage(page, serverUrl, initialState);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('hide-captions-banner.png');
  });

  test('Captions settings triggered by caption banner correctly on desktop', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }
    await loadCallPage(page, serverUrl, initialState);
    await pageClick(page, dataUiId('captions-banner-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-settings-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot('trigger-settings-from-banner.png');
  });

  test('Captions menu shows correctly with chat pane', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }

    await loadCallPage(page, serverUrl, initialState);

    await pageClick(page, dataUiId('call-with-chat-composite-chat-button'));
    await waitForSelector(page, dataUiId('sendbox-textfield'));
    expect(await stableScreenshot(page)).toMatchSnapshot('captions-with-chat-pane.png');
  });

  test('Captions menu shows correctly with people pane', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.call.captionsFeature = captionsFeatureState;
    }

    await loadCallPage(page, serverUrl, initialState);

    await pageClick(page, dataUiId('common-call-composite-people-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('captions-with-people-pane.png');
  });
});
