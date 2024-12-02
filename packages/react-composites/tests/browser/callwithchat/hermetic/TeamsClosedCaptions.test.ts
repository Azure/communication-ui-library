// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { loadCallPage, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS, captionsFeatureState, captionsFeatureStateArabic } from '../../common/constants';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';

test.describe('Teams Closed Captions Banner tests', async () => {
  test('Show loading banner when start captions is clicked but captions is not started yet', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.isTeamsMeeting = true;
      initialState.call.captionsFeature = {
        ...captionsFeatureState,
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: true
      };

      initialState.call.captionsFeature.captionsKind = 'TeamsCaptions';
    }
    await loadCallPage(page, serverUrl, initialState);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('teams-captions-loading-banner.png');
  });

  test('Show closed captions banner when enabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.isTeamsMeeting = true;
      initialState.call.captionsFeature = captionsFeatureState;

      initialState.call.captionsFeature.captionsKind = 'TeamsCaptions';
    }
    await loadCallPage(page, serverUrl, initialState);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-teams-captions.png');
  });

  test('Show RTL languages from right to left', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.isTeamsMeeting = true;
      initialState.call.captionsFeature = captionsFeatureStateArabic;

      initialState.call.captionsFeature.captionsKind = 'TeamsCaptions';
    }
    await loadCallPage(page, serverUrl, initialState);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-teams-captions-RTL.png');
  });

  test('Captions menu shows correct when clicked on desktop', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.isTeamsMeeting = true;
      initialState.call.captionsFeature = captionsFeatureState;

      initialState.call.captionsFeature.captionsKind = 'TeamsCaptions';
    }
    await loadCallPage(page, serverUrl, initialState);
    await pageClick(page, dataUiId('captions-banner-more-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('show-teams-captions-menu-on-banner.png');
  });

  test('Hide closed captions banner when disabled', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.isTeamsMeeting = true;
      initialState.call.captionsFeature = {
        ...captionsFeatureState,
        isCaptionsFeatureActive: false,
        startCaptionsInProgress: false
      };

      initialState.call.captionsFeature.captionsKind = 'TeamsCaptions';
    }
    await loadCallPage(page, serverUrl, initialState);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('teams-captions-closed.png');
  });

  test('Captions settings triggered by caption banner correctly on desktop', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.isTeamsMeeting = true;
      initialState.call.captionsFeature = captionsFeatureState;

      initialState.call.captionsFeature.captionsKind = 'TeamsCaptions';
    }
    await loadCallPage(page, serverUrl, initialState);
    await pageClick(page, dataUiId('captions-banner-more-button'));
    await pageClick(page, `[id="common-call-composite-captions-settings-button"]`);
    expect(await stableScreenshot(page)).toMatchSnapshot('trigger-teams-captions-settings-from-banner.png');
  });

  test('Captions menu shows correctly with chat pane', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.isTeamsMeeting = true;
      initialState.call.captionsFeature = captionsFeatureState;

      initialState.call.captionsFeature.captionsKind = 'TeamsCaptions';
    }

    await loadCallPage(page, serverUrl, initialState);

    await pageClick(page, dataUiId('call-with-chat-composite-chat-button'));
    await waitForSelector(page, dataUiId('sendbox-textfield'));
    expect(await stableScreenshot(page)).toMatchSnapshot('teams-captions-with-chat-pane.png');
  });

  test('Captions menu shows correctly with people pane', async ({ page, serverUrl }, testInfo) => {
    if (isTestProfileMobile(testInfo)) {
      test.skip();
    }
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    if (initialState?.call) {
      initialState.isTeamsMeeting = true;
      initialState.call.captionsFeature = captionsFeatureState;

      initialState.call.captionsFeature.captionsKind = 'TeamsCaptions';
    }

    await loadCallPage(page, serverUrl, initialState);

    await pageClick(page, dataUiId('common-call-composite-people-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('teams-captions-with-people-pane.png');
  });
});
