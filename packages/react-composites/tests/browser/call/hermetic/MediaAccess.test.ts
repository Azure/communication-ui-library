// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';

/* @conditional-compile-remove(media-access) */
test.describe('Media access mic/camera forbid/permit tests', async () => {
  test('When capabilities true, mic and carmera enabled on call control bar and self video tile', async ({
    page,
    serverUrl
  }, testInfo) => {
    const Paul = defaultMockRemoteParticipant('Paul Blurt');
    const participants = [Paul];
    const initialState = defaultMockCallAdapterState(participants, 'Presenter', false, undefined, true);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
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
    const initialState = defaultMockCallAdapterState(participants, 'Attendee', false, undefined, undefined, true);
    if (initialState.call) {
      initialState.call.isMuted = true;
    }

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
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
