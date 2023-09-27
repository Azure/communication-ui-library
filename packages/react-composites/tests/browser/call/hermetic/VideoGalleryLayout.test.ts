// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
import { exec } from 'node:child_process';

test.describe('VideoGalleryLayout tests', async () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    let freeRam = 0;
    while (freeRam < 1000) {
      exec("free -m | awk 'NR==2 {print $4}'", (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
          // log and return if we encounter an error
          console.error('could not execute command: ', err);
          return;
        }
        // log the output received from the command
        console.log(`Free RAM during test ${JSON.stringify(testInfo.title)}: \n`, output);
        freeRam = parseInt(output);
      });
      if (freeRam >= 1000) {
        return;
      }
      console.log(`${freeRam}MB is not enough RAM for test ${JSON.stringify(testInfo.title)}. Waiting 10s...\n`);
      await new Promise((r) => setTimeout(r, 10000));
    }
  });
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
