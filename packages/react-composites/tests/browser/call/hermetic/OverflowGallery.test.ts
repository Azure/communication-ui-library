// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { dataUiId, dragToRight, existsOnPage, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import {
  addScreenshareStream,
  addVideoStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  defaultMockRemotePSTNParticipant,
  test
} from './fixture';

test.describe('Overflow gallery tests', async () => {
  test('Overflow gallery should have 1 audio participant', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);

    const participants = [paul, defaultMockRemoteParticipant('Eryka Klein'), fiona];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-1-audio-participant.png');
  });

  test('Overflow gallery should work in right-to-left', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);

    const participants = [paul, defaultMockRemoteParticipant('Eryka Klein'), fiona];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { rtl: 'true' }));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-in-rtl-with-1-audio-participant.png');
  });

  test('Overflow gallery should have multiple audio participants spanning multiple pages. Navigation buttons should work.', async ({
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
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-many-audio-participants-on-page-1.png');

    /* @conditional-compile-remove(pinned-participants) */
    if (await existsOnPage(page, dataUiId('scrollable-horizontal-gallery'))) {
      await dragToRight(page, dataUiId('scrollable-horizontal-gallery'));
      expect(await stableScreenshot(page)).toMatchSnapshot(
        'scrollable-horizontal-gallery-with-many-audio-participants-dragged.png'
      );
      return;
    }

    await waitForSelector(page, dataUiId(IDS.overflowGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.overflowGalleryRightNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-many-audio-participants-on-page-2.png');
    await waitForSelector(page, dataUiId(IDS.overflowGalleryLeftNavButton));
    await pageClick(page, dataUiId(IDS.overflowGalleryLeftNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-many-audio-participants-on-page-1.png');
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('Overflow gallery should have 1 PSTN participant', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    const vasily = defaultMockRemotePSTNParticipant('+15553334444');
    vasily.state = 'Ringing';

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-joining-participant.png');
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('Overflow gallery should have multiple audio participants and 1 PSTN participant', async ({
    page,
    serverUrl
  }) => {
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
      'overflow-gallery-with-joining-participant-with-audio-participants.png'
    );
  });

  /* @conditional-compile-remove(PSTN-calls) @conditional-compile-remove(pinned-participants) */
  test('Overflow gallery should have multiple audio participants and 1 PSTN participant on second page', async ({
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
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Ringing';

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

    /* @conditional-compile-remove(pinned-participants) */
    if (await existsOnPage(page, dataUiId('scrollable-horizontal-gallery'))) {
      await dragToRight(page, dataUiId('scrollable-horizontal-gallery'));
      expect(await stableScreenshot(page)).toMatchSnapshot(
        'scrollable-horizontal-gallery-with-joining-participant-dragged.png'
      );
      return;
    }

    await waitForSelector(page, dataUiId(IDS.overflowGalleryRightNavButton));
    await pageClick(page, dataUiId(IDS.overflowGalleryRightNavButton));
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'overflow-gallery-with-joining-participant-with-multi-page.png'
    );
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('Overflow gallery should have 2 video participants during screenshare and 1 PSTN participant', async ({
    page,
    serverUrl
  }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    addVideoStream(paul, true);
    addScreenshareStream(paul, true);
    paul.isSpeaking = true;
    const fiona = defaultMockRemoteParticipant('Fiona Harper');
    addVideoStream(fiona, true);
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    reina.isSpeaking = true;
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Ringing';

    const participants = [paul, fiona, reina, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'overflow-gallery-with-joining-participant-with-screen-share-and-video.png'
    );
  });

  /*
    This test should actually be stabilized only when *both* the `PSTN-calls` and `one-to-n-calling`
    features are stabilized.
    There is no way to specify this in conditional compilation directives though.

    If one of these features is stabilized alone, this test will be stabilized, and will likely fail.
    We will need to update the conditional compilation directive at that time to only reference
    the unstabilized feature.

    @conditional-compile-remove(PSTN-calls) @conditional-compile-remove(one-to-n-calling)
  */
  test('Overflow gallery should have 1 PSTN and 1 1-N participants', async ({ page, serverUrl }) => {
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    addVideoStream(reina, true);
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    paul.state = 'Ringing';
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Ringing';
    phoneUser.isMuted = false;

    const participants = [reina, paul, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-2-joining-participants.png');
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('Overflow gallery should have 1 PSTN and 1 On Hold participant', async ({ page, serverUrl }) => {
    const reina = defaultMockRemoteParticipant('Reina Takizawa');
    reina.state = 'Hold';
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Ringing';

    const participants = [reina, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('overflow-gallery-with-1-joining-1-hold-participants.png');
  });
});
