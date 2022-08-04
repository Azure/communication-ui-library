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
import { dataUiId, pageClick, waitForSelector, stableScreenshot } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('HorizontalGallery tests', async () => {
  test('HorizontalGallery should have 1 audio participant', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);

    const participants = [paul, defaultMockRemoteParticipant('Eryka Klein'), fiona];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'horizontal-gallery-with-1-audio-participant.png'
    );
  });

  test('HorizontalGallery should have multiple audio participants spanning multiple pages. Navigation buttons should work.', async ({
    page,
    serverUrl
  }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    reina.isSpeaking = true;
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    vasily.isMuted = true;

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

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'horizontal-gallery-with-many-audio-participants-on-page-1.png'
    );
    await waitForSelector(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'horizontal-gallery-with-many-audio-participants-on-page-2.png'
    );
    await waitForSelector(page, dataUiId(IDS.horizontalGalleryLeftNavButton));
    await pageClick(page, dataUiId(IDS.horizontalGalleryLeftNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'horizontal-gallery-with-many-audio-participants-on-page-1.png'
    );
  });
});
