// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { dataUiId, isTestProfileStableFlavor, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import {
  addScreenshareStream,
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  defaultMockRemotePSTNParticipant,
  test
} from './fixture';

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
    expect(await stableScreenshot(page)).toMatchSnapshot('horizontal-gallery-with-1-audio-participant.png');
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
    expect(await stableScreenshot(page)).toMatchSnapshot(
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

  test('HorizontalGallery should have 1 PSTN participant in the horizontal gallery', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    vasily.state = 'Connecting';

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('horizontal-gallery-with-joining-participant.png');
  });

  test('HorizontalGallery should have multiple audio participants and 1 PSTN participant', async ({
    page,
    serverUrl
  }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    reina.isSpeaking = true;
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Connecting';

    const participants = [paul, fiona, reina, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'horizontal-gallery-with-joining-participant-with-audio-participants.png'
    );
  });

  test('HorizontalGallery should have multiple audio participants and 1 PSTN participant on second page', async ({
    page,
    serverUrl
  }) => {
    test.skip(isTestProfileStableFlavor());
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    reina.isSpeaking = true;
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Connecting';

    const participants = [
      paul,
      fiona,
      reina,
      phoneUser,
      defaultMockRemoteParticipant('Luciana Rodriguez'),
      defaultMockRemoteParticipant('Antonie van Leeuwenhoek'),
      defaultMockRemoteParticipant('Gerald Ho'),
      defaultMockRemoteParticipant('Pardeep Singh'),
      defaultMockRemoteParticipant('Eryka Klein')
    ];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await waitForSelector(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.horizontalGalleryRightNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'horizontal-gallery-with-joining-participant-with-multi-page.png'
    );
  });

  test('HorizontalGallery should have 2 video participants during screenshare and 1 PSTN participant', async ({
    page,
    serverUrl
  }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    addScreenshareStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    reina.isSpeaking = true;
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Connecting';

    const participants = [paul, fiona, reina, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'horizontal-gallery-with-joining-participant-with-screen-share-and-video.png'
    );
  });

  test('Horizontal gallery Should have 1 PSTN and 1 1-N participants', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    addVideoStream(reina, true);
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    paul.state = 'Ringing';
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Connecting';
    phoneUser.isMuted = false;

    const participants = [reina, paul, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('horizontal-gallery-with-2-joining-participants.png');
  });

  test('Horizontal gallery Should have 1 PSTN and 1 On Hold participant', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    reina.state = 'Hold';
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Connecting';

    const participants = [reina, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('horizontal-gallery-with-1-joining-1-hold-participants.png');
  });
});
