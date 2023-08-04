// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from '../../common/constants';
import { expect } from '@playwright/test';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';

/* @conditional-compile-remove(click-to-call) */
test.describe('Call Composite E2E local video tile control tests', () => {
  test('Call composite should not have a video tile when hidden', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul');
    const terry = defaultMockRemoteParticipant('Terry');
    const james = defaultMockRemoteParticipant('James');
    const participants = [paul, terry, james];

    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        localVideoTilePosition: 'false'
      })
    );

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-gallery-with-hidden-local-video-tile.png');
  });

  test('Call composite should have a video tile in the main gallery when in gird', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul');
    const terry = defaultMockRemoteParticipant('Terry');
    const james = defaultMockRemoteParticipant('James');
    const participants = [paul, terry, james];

    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        localVideoTilePosition: 'grid'
      })
    );

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-gallery-with-grid-local-video-tile.png');
  });

  test('Call composite should have a floating video tile when floating', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul');
    const terry = defaultMockRemoteParticipant('Terry');
    const james = defaultMockRemoteParticipant('James');
    const participants = [paul, terry, james];

    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        localVideoTilePosition: 'floating'
      })
    );

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-gallery-with-floating-local-video-tile.png');
  });
});
