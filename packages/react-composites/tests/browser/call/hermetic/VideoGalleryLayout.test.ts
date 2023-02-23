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
/* @conditional-compile-remove(pinned-participants) */
import { screenshotOnFailure, perStepLocalTimeout } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('VideoGalleryLayout tests', async () => {
  /* @conditional-compile-remove(pinned-participants) */
  test('VideoTile contextual menu shows "Fit to frame" by default', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);

    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoTile));
    await page.hover(dataUiId(IDS.videoTile));
    await waitForSelector(page, dataUiId(IDS.videoTileMoreOptionsButton));
    // not using 'pageclick' method as it brings page to front and we need the focus on video tile
    await screenshotOnFailure(
      page,
      async () => await page.click(dataUiId(IDS.videoTileMoreOptionsButton), { timeout: perStepLocalTimeout() })
    );

    expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-fit-to-frame.png');
  });
  /* @conditional-compile-remove(pinned-participants) */
  test('VideoTile contextual menu shows "Fill frame" when scaling mode set to Fit', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true, 'Fit');

    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoTile));
    await page.hover(dataUiId(IDS.videoTile));
    await waitForSelector(page, dataUiId(IDS.videoTileMoreOptionsButton));
    await screenshotOnFailure(
      page,
      async () => await page.click(dataUiId(IDS.videoTileMoreOptionsButton), { timeout: perStepLocalTimeout() })
    );

    expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-fill-frame.png');
  });
  /* @conditional-compile-remove(pinned-participants) */
  test('VideoTile pin/unpin the remote participant for Desktop', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);

    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoTile));
    await page.hover(dataUiId(IDS.videoTile));
    await waitForSelector(page, dataUiId(IDS.videoTileMoreOptionsButton));
    await screenshotOnFailure(
      page,
      async () => await page.click(dataUiId(IDS.videoTileMoreOptionsButton), { timeout: perStepLocalTimeout() })
    );

    await waitForSelector(page, dataUiId('video-tile-pin-participant-button'));
    await pageClick(page, dataUiId('video-tile-pin-participant-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-pinned.png');

    await page.hover(dataUiId(IDS.videoTile));
    await waitForSelector(page, dataUiId(IDS.videoTileMoreOptionsButton));
    await screenshotOnFailure(
      page,
      async () => await page.click(dataUiId(IDS.videoTileMoreOptionsButton), { timeout: perStepLocalTimeout() })
    );

    expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-unpin.png');
  });
});
