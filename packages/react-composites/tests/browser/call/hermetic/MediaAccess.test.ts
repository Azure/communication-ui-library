// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('Media access mic/camera forbid/permit tests', async () => {
  test('When capabilities true, mic and carmera enabled on call control bar and self video tile', async ({
    page,
    serverUrl
  }, testInfo) => {
    const Paul = defaultMockRemoteParticipant('Paul Blurt');
    const participants = [Paul];
    const initialState = defaultMockCallAdapterState(participants, 'Presenter', false, undefined, true);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await page.pause();
    if (isTestProfileMobile(testInfo)) {
      await waitForSelector(page, dataUiId(IDS.microphoneButton));
      await waitForSelector(page, dataUiId(IDS.cameraButton));

      expect(await stableScreenshot(page)).toMatchSnapshot(
        'media-access-audio-video-permitted-in-ongoing-call-mobile.png'
      );
    } else {
      await waitForSelector(page, dataUiId(IDS.microphoneButton));
      await waitForSelector(page, dataUiId(IDS.cameraButton));

      expect(await stableScreenshot(page)).toMatchSnapshot(
        'media-access-audio-video-permitted-in-ongoing-call-desktop.png'
      );
    }
  });
  test('When capabilities false, mic and carmera disabled on call control bar and self video tile', async ({
    page,
    serverUrl
  }, testInfo) => {
    const Paul = defaultMockRemoteParticipant('Paul Blurt');
    const participants = [Paul];
    const initialState = defaultMockCallAdapterState(participants, 'Attendee');
    if (initialState.call?.capabilitiesFeature?.capabilities) {
      initialState.call.capabilitiesFeature.capabilities.unmuteMic.isPresent = false;
      initialState.call.capabilitiesFeature.capabilities.unmuteMic.reason = 'MeetingRestricted';
      initialState.call.capabilitiesFeature.capabilities.turnVideoOn.isPresent = false;
      initialState.call.capabilitiesFeature.capabilities.turnVideoOn.reason = 'MeetingRestricted';
      initialState.call.state = 'Connected';
      initialState.call.isMuted = true;
    }

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await page.pause();
    if (isTestProfileMobile(testInfo)) {
      await waitForSelector(page, dataUiId(IDS.microphoneButton));
      await waitForSelector(page, dataUiId(IDS.cameraButton));

      expect(await stableScreenshot(page)).toMatchSnapshot(
        'media-access-audio-video-forbidden-in-ongoing-call-mobile.png'
      );
    } else {
      await waitForSelector(page, dataUiId(IDS.microphoneButton));
      await waitForSelector(page, dataUiId(IDS.cameraButton));

      expect(await stableScreenshot(page)).toMatchSnapshot(
        'media-access-audio-video-forbidden-in-ongoing-call-desktop.png'
      );
    }
  });
});
