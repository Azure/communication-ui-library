// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import {
  dataUiId,
  dragToRight,
  existsOnPage,
  isTestProfileMobile,
  pageClick,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import {
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';

test.describe('Vertical gallery resizing tests', async () => {
  test.only('resize should have the tiles all change to the same size within expected bounds', async ({
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
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    // set the initial viewPort size to activate the verticalGallery.
    page.setViewportSize({ width: 1200, height: 500 });
    // wait for the tiles to load
    const verticalTiles = await waitForSelector(page, dataUiId(IDS.verticalGalleryVideoTile));

    // check that the initial sizes are correct for the vertical tiles.
    expect(await verticalTiles.evaluate((e) => (e as HTMLDivElement).clientHeight)).toBeGreaterThanOrEqual(90);
    expect(await verticalTiles.evaluate((e) => (e as HTMLDivElement).clientHeight)).toBeLessThanOrEqual(144);

    // resize the window.
    page.setViewportSize({ width: 1200, height: 600 });

    // verify that the sizes are still within the correct boundaries.
    expect(await verticalTiles.evaluate((e) => (e as HTMLDivElement).clientHeight)).toBeGreaterThanOrEqual(90);
    expect(await verticalTiles.evaluate((e) => (e as HTMLDivElement).clientHeight)).toBeLessThanOrEqual(144);
  });
  test.only('resize should appropriately add tiles if room', async ({ page, serverUrl }, testInfo) => {
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
    // set the initial viewPort size to activate the verticalGallery.
    page.setViewportSize({ width: 1200, height: 500 });
    // wait for the tiles to load
    await waitForSelector(page, dataUiId(IDS.verticalGalleryVideoTile));

    // check initial tile number to be correct.
    expect(await page.locator(dataUiId(IDS.verticalGalleryVideoTile)).count()).toBe(2);

    // resize the window.
    page.setViewportSize({ width: 1200, height: 600 });

    // verify that we added a tile with the extra spacing.
    expect(await page.locator(dataUiId(IDS.verticalGalleryVideoTile)).count()).toBe(3);
  });
  test('resize should appropriately remove tiles if needed', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    console.error(await page.locator(dataUiId(IDS.verticalGalleryVideoTile)).count());
  });
  test('resize should remove pages appropriately', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
  });
  test('resize should add pages appropriatly', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
  });
  test('single user on last page should use largest size', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
  });
});
