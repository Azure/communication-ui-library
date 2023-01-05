// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, waitForSelector, stableScreenshot, isTestProfileMobile, pageClick } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('VideoGalleryLayout tests', async () => {
  /* @conditional-compile-remove(pinned-participants) */
  test.only('VideoTile Clicking Fit to frame should show the entire remote video stream in a video tile', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);

    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await waitForSelector(page, dataUiId(IDS.videoTileMoreOptionsButton));
    await pageClick(page, dataUiId(IDS.videoTileMoreOptionsButton));

    await waitForSelector(page, dataUiId('video-tile-fit-to-frame'));
    await pageClick(page, dataUiId('video-tile-fit-to-frame'));

    expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-fit-to-frame.png');

    await waitForSelector(page, dataUiId(IDS.videoTileMoreOptionsButton));
    await pageClick(page, dataUiId(IDS.videoTileMoreOptionsButton));

    // await waitForSelector(page, dataUiId('video-tile-fill-frame'));
    // await pageClick(page, dataUiId('video-tile-fill-frame'));

    expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-fill-frame.png');
  });
});
