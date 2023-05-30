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
  test('VideoTile contextual menu shows "Fit to frame" by default', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);

    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    const videoGallery = await waitForSelector(page, dataUiId(IDS.videoGallery));

    for (let i = 1; i < 2; i++) {
      const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=${i}`);
      await videoTile.hover();
      const moreButton = await videoTile.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
      await moreButton.hover();
      await moreButton.click();

      expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-fit-to-frame.png');
    }
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
    const videoGallery = await waitForSelector(page, dataUiId(IDS.videoGallery));

    for (let i = 1; i < 2; i++) {
      const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=${i}`);
      await videoTile.hover();
      const moreButton = await videoTile.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
      await moreButton.hover();
      await moreButton.click();
      // click pin menu button in contextual menu
      await pageClick(page, dataUiId('video-tile-pin-participant-button'));

      expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-fill-frame.png');
    }
  });
  /* @conditional-compile-remove(pinned-participants) */
  test('VideoTile pin/unpin the remote participant for Desktop', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);

    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    const videoGallery = await waitForSelector(page, dataUiId(IDS.videoGallery));
    let videoTile;
    let moreButton;

    for (let i = 1; i < 2; i++) {
      videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=${i}`);
      await videoTile.hover();
      moreButton = await videoTile.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
      await moreButton.hover();
      await moreButton.click();

      await waitForSelector(page, dataUiId('video-tile-pin-participant-button'));
      await pageClick(page, dataUiId('video-tile-pin-participant-button'));
    }
    expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-pinned.png');

    await videoTile.hover();
    moreButton = await videoTile.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
    await moreButton.hover();
    await moreButton.click();

    expect(await stableScreenshot(page)).toMatchSnapshot('video-tile-unpin.png');
  });
});
