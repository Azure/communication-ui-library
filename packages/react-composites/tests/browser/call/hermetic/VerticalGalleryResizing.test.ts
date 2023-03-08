// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { dataUiId, isTestProfileMobile, pageClick, waitForSelector } from '../../common/utils';
import {
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';

/* @conditional-compile-remove(vertical-gallery) */
test.describe('Vertical gallery resizing tests', async () => {
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
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    // set the initial viewPort size to activate the verticalGallery.
    await page.setViewportSize({ width: 1200, height: 500 });
    // wait for the tiles to load
    const verticalTiles = await waitForSelector(page, dataUiId(IDS.verticalGalleryVideoTile));

    // check that the initial sizes are correct for the vertical tiles.
    expect(await verticalTiles.evaluate((e) => (e as HTMLDivElement).clientHeight)).toBeGreaterThanOrEqual(108);
    expect(await verticalTiles.evaluate((e) => (e as HTMLDivElement).clientHeight)).toBeLessThanOrEqual(176);

    // resize the window.
    await page.setViewportSize({ width: 1200, height: 600 });

    // verify that the sizes are still within the correct boundaries.
    expect(await verticalTiles.evaluate((e) => (e as HTMLDivElement).clientHeight)).toBeGreaterThanOrEqual(108);
    expect(await verticalTiles.evaluate((e) => (e as HTMLDivElement).clientHeight)).toBeLessThanOrEqual(176);
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
    // set the initial viewPort size to activate the verticalGallery.
    await page.setViewportSize({ width: 1200, height: 500 });
    // wait for the tiles to load
    await waitForSelector(page, dataUiId(IDS.verticalGalleryVideoTile));

    // check initial tile number to be correct.
    expect(await page.locator(dataUiId(IDS.verticalGalleryVideoTile)).count()).toBe(2);

    // resize the window.
    await page.setViewportSize({ width: 1200, height: 600 });

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    // wait for the tiles to load
    await waitForSelector(page, dataUiId(IDS.verticalGalleryVideoTile));

    // verify that we added a tile with the extra spacing.
    expect(await page.locator(dataUiId(IDS.verticalGalleryVideoTile)).count()).toBe(3);
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
    // set the initial viewPort size to activate the verticalGallery.
    await page.setViewportSize({ width: 1200, height: 600 });
    // wait for the tiles to load
    await waitForSelector(page, dataUiId(IDS.verticalGalleryVideoTile));

    // check initial tile number to be correct.
    expect(await page.locator(dataUiId(IDS.verticalGalleryVideoTile)).count()).toBe(3);

    // resize the window.
    await page.setViewportSize({ width: 1200, height: 500 });

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    // verify that we added a tile with the extra spacing.
    expect(await page.locator(dataUiId(IDS.verticalGalleryVideoTile)).count()).toBe(2);
  });
  test('resize should remove pages appropriately', async ({ page, serverUrl }, testInfo) => {
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
    await page.setViewportSize({ width: 1200, height: 600 });

    let pageCounter = await waitForSelector(page, dataUiId(IDS.verticalGalleryPageCounter));

    expect(await pageCounter.evaluate((e) => (e as HTMLDivElement).innerText)).toBe('1 / 3');

    // increase the page size to remove a page
    await page.setViewportSize({ width: 1200, height: 700 });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    pageCounter = await waitForSelector(page, dataUiId(IDS.verticalGalleryPageCounter));

    expect(await pageCounter.evaluate((e) => (e as HTMLDivElement).innerText)).toBe('1 / 2');
  });
  test('resize should add pages appropriatly', async ({ page, serverUrl }, testInfo) => {
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
    await page.setViewportSize({ width: 1200, height: 700 });

    let pageCounter = await waitForSelector(page, dataUiId(IDS.verticalGalleryPageCounter));

    expect(await pageCounter.evaluate((e) => (e as HTMLDivElement).innerText)).toBe('1 / 2');

    // increase the page size to remove a page
    await page.setViewportSize({ width: 1200, height: 600 });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    pageCounter = await waitForSelector(page, dataUiId(IDS.verticalGalleryPageCounter));

    expect(await pageCounter.evaluate((e) => (e as HTMLDivElement).innerText)).toBe('1 / 3');
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

    await page.setViewportSize({ width: 1200, height: 500 });

    await waitForSelector(page, dataUiId(IDS.overflowGalleryRightNavButton));
    // since we know that we have 2 tiles per page in this view port gerald will be the last participant.
    await pageClick(page, dataUiId(IDS.overflowGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.overflowGalleryRightNavButton));

    const verticalTiles = await waitForSelector(page, dataUiId(IDS.verticalGalleryVideoTile));

    expect(await verticalTiles.evaluate((e) => (e as HTMLDivElement).clientHeight)).toBe(176);
  });
});
