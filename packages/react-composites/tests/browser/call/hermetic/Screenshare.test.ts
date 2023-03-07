// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  addScreenshareStream,
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  test
} from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, dragToRight, existsOnPage, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';
import type { MockCallState } from '../../../common';

test.describe('Screenshare tests', async () => {
  test('Local screenshare notification should be displayed in grid area of VideoGallery when local participant is screensharing', async ({
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
    (initialState.call as MockCallState).isScreenSharingOn = true;
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('local-screenshare.png');
  });

  test('Remote screen share stream should be displayed in grid area of VideoGallery.', async ({ page, serverUrl }) => {
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    reina.isSpeaking = true;
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    vasily.isMuted = true;
    const helen = defaultMockRemoteParticipant('Helen Sediq');
    addScreenshareStream(helen, true);
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);

    const participants = [
      defaultMockRemoteParticipant('Pardeep Singh'),
      reina,
      vasily,
      defaultMockRemoteParticipant('Luciana Rodriguez'),
      defaultMockRemoteParticipant('Antonie van Leeuwenhoek'),
      defaultMockRemoteParticipant('Gerald Ho'),
      helen,
      paul,
      defaultMockRemoteParticipant('Eryka Klein'),
      fiona
    ];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    expect(await stableScreenshot(page)).toMatchSnapshot('remote-screenshare-horizontal-gallery-page-1.png');

    /* @conditional-compile-remove(pinned-participants) */
    if (await existsOnPage(page, dataUiId('scrollable-horizontal-gallery'))) {
      await dragToRight(page, dataUiId('scrollable-horizontal-gallery'));
      expect(await stableScreenshot(page)).toMatchSnapshot(
        'remote-screenshare-scrollable-horizontal-gallery-dragged.png'
      );
      return;
    }

    await waitForSelector(page, dataUiId(IDS.overflowGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.overflowGalleryRightNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('remote-screenshare-horizontal-gallery-page-2.png');
    await waitForSelector(page, dataUiId(IDS.overflowGalleryLeftNavButton));
    await pageClick(page, dataUiId(IDS.overflowGalleryLeftNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('remote-screenshare-horizontal-gallery-back-to-page-1.png');
  });
});
