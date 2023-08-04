// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { dataUiId, isTestProfileMobile, pageClick, waitForSelector, waitForSelectorCount } from '../../common/utils';
import {
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';

/* @conditional-compile-remove(vertical-gallery) */
test.describe('Height gallery resizing tests', async () => {
  test('resize should have the tiles all change to the same size within expected bounds', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');

    const participants = [
      paul,
      defaultMockRemoteParticipant('Eryka Klein'),
      fiona,
      defaultMockRemoteParticipant('Pardeep Singh'),
      reina,
      vasily,
      defaultMockRemoteParticipant('Luciana Rodriguez'),
      defaultMockRemoteParticipant('Antonie van Leeuwenhoek'),
      defaultMockRemoteParticipant('Gerald Ho')
    ];

    const initialState = defaultMockCallAdapterState(participants);
    // set the initial viewPort size to activate the horizontalGallery.
    await page.setViewportSize({ width: 500, height: 500 });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    // wait for the tiles to load
    const horiztonalTiles = await waitForSelector(page, dataUiId(IDS.horizontalGalleryVideoTile));
    console.log(await horiztonalTiles.evaluate((e) => (e as HTMLDivElement).clientWidth));
    // check that the initial sizes are correct for the vertical tiles.
    expect(await horiztonalTiles.evaluate((e) => (e as HTMLDivElement).clientWidth)).toBeGreaterThanOrEqual(120);
    expect(await horiztonalTiles.evaluate((e) => (e as HTMLDivElement).clientWidth)).toBeLessThanOrEqual(215);

    // resize the window.
    await page.setViewportSize({ width: 600, height: 500 });

    // verify that the sizes are still within the correct boundaries.
    expect(await horiztonalTiles.evaluate((e) => (e as HTMLDivElement).clientWidth)).toBeGreaterThanOrEqual(120);
    expect(await horiztonalTiles.evaluate((e) => (e as HTMLDivElement).clientWidth)).toBeLessThanOrEqual(215);
  });
  test('resize should appropriately add tiles if room', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');

    const participants = [
      paul,
      defaultMockRemoteParticipant('Eryka Klein'),
      fiona,
      defaultMockRemoteParticipant('Pardeep Singh'),
      reina,
      vasily,
      defaultMockRemoteParticipant('Luciana Rodriguez'),
      defaultMockRemoteParticipant('Antonie van Leeuwenhoek'),
      defaultMockRemoteParticipant('Gerald Ho')
    ];

    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    // set the initial viewPort size to activate the horizontalGallery.
    await page.setViewportSize({ width: 600, height: 600 });
    // wait for the tiles to load
    await waitForSelector(page, dataUiId(IDS.horizontalGalleryVideoTile));

    // check initial tile number to be correct.
    await waitForSelectorCount(page, dataUiId(IDS.horizontalGalleryVideoTile), 2);

    // resize the window.
    await page.setViewportSize({ width: 800, height: 600 });

    // verify that we added a tile with the extra spacing.
    await waitForSelectorCount(page, dataUiId(IDS.horizontalGalleryVideoTile), 3);
  });
  test('resize should appropriately remove tiles if needed', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');

    const participants = [
      paul,
      defaultMockRemoteParticipant('Eryka Klein'),
      fiona,
      defaultMockRemoteParticipant('Pardeep Singh'),
      reina,
      vasily,
      defaultMockRemoteParticipant('Luciana Rodriguez'),
      defaultMockRemoteParticipant('Antonie van Leeuwenhoek'),
      defaultMockRemoteParticipant('Gerald Ho')
    ];

    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    // set the initial viewPort size to activate the horizontalGallery.
    await page.setViewportSize({ width: 800, height: 600 });
    // wait for the tiles to load
    await waitForSelector(page, dataUiId(IDS.horizontalGalleryVideoTile));

    // check initial tile number to be correct.
    await waitForSelectorCount(page, dataUiId(IDS.horizontalGalleryVideoTile), 3);

    // resize the window.
    await page.setViewportSize({ width: 600, height: 600 });

    // verify that we added a tile with the extra spacing.
    await waitForSelectorCount(page, dataUiId(IDS.horizontalGalleryVideoTile), 2);
  });
  test('single user on last page should use largest size', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);

    const participants = [
      paul,
      defaultMockRemoteParticipant('Eryka Klein'),
      defaultMockRemoteParticipant('Fiona Harper'),
      defaultMockRemoteParticipant('Reina Takizawa'),
      defaultMockRemoteParticipant('Luciana Rodriguez'),
      defaultMockRemoteParticipant('Gerald Ho')
    ];

    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await page.setViewportSize({ width: 600, height: 600 });

    await waitForSelector(page, dataUiId(IDS.overflowGalleryRightNavButton));
    // since we know that we have 2 tiles per page in this view port gerald will be the last participant.
    await pageClick(page, dataUiId(IDS.overflowGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.overflowGalleryRightNavButton));

    const horiztonalTiles = await waitForSelector(page, dataUiId(IDS.horizontalGalleryVideoTile));

    expect(await horiztonalTiles.evaluate((e) => (e as HTMLDivElement).clientWidth)).toBe(215);
  });
});
