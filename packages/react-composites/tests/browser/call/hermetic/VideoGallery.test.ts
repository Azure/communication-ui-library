// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  addScreenshareStream,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  defaultMockRemotePSTNParticipant,
  test
} from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, waitForSelector, stableScreenshot, pageClick, isTestProfileMobile } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('VideoGallery tests', async () => {
  test.beforeEach(async () => await new Promise((r) => setTimeout(r, 2000)));
  test('VideoGallery should show unnamed local and remote participant avatars using person icon instead of initials', async ({
    page,
    serverUrl
  }) => {
    const paul = defaultMockRemoteParticipant('');
    paul.state = 'Connected';

    const participants = [paul];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        ...initialState,
        displayName: ''
      })
    );

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-avatar-with-person-icon-when-no-displayname.png');
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('VideoGallery Should have 1 Audio participant and one PSTN participant', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemotePSTNParticipant('+15551236789');
    vasily.isMuted = true;
    vasily.state = 'Ringing';

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    expect(await stableScreenshot(page)).toMatchSnapshot('video-gallery-with-one-joining-gridview-participant.png');
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
  test('VideoGallery Should have 1 PSTN and 1 1-N participants', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    paul.state = 'Ringing';
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Ringing';

    const participants = [paul, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-gallery-with-2-joining-gridview-participant.png');
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('VideoGallery Should show the remote participant on hold', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    paul.state = 'Hold';
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Ringing';

    const participants = [paul, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'video-gallery-with-1-joining-1-hold-gridview-participant.png'
    );
  });

  /* @conditional-compile-remove(pinned-participants) */
  test('Remote video tile pin menu button should be disabled when max remote video tiles are pinned', async ({
    page,
    serverUrl
  }, testInfo) => {
    // @TODO: Test that pin menu item is disabled when maximum remote VideoTiles are pinned in VideoGallery when
    // drawer menu on long touch has been implemented
    test.skip(isTestProfileMobile(testInfo));
    const displayNames = ['Tony Hawk', 'Marie Curie', 'Gal Gadot', 'Margaret Atwood', 'Kobe Bryant', "Conan O'Brien"];
    const participants = displayNames.map((name) => defaultMockRemoteParticipant(name));
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    const videoGallery = await waitForSelector(page, dataUiId(IDS.videoGallery));

    // pin remote video tiles in video gallery up to the max allowed in the call composite.
    // skip the first tile because it is the local video tile
    for (let i = 1; i < 5; i++) {
      const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=${i}`);
      await videoTile.hover();
      const moreButton = await videoTile.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
      await moreButton.click();
      // click pin menu button in contextual menu
      await pageClick(page, dataUiId('video-tile-pin-participant-button'));
    }
    // hover the sixth remote video tile which is presumably an unpinned remote video tile
    const sixthVideoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=5`);
    sixthVideoTile.hover();
    const moreButton = await sixthVideoTile.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
    moreButton.click();
    await waitForSelector(page, dataUiId('video-tile-pin-participant-button'));
    // take snapshot to verify pin button is disabled
    expect(await stableScreenshot(page)).toMatchSnapshot('disabled-pin-menu-button.png');
  });
  /* @conditional-compile-remove(gallery-layouts) */
  test('VideoGallery should show one tile when in speaker mode', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Pupkin');
    vasily.isSpeaking = true;
    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, { galleryLayout: 'speaker', newControlBarExperience: 'true' })
    );

    await waitForSelector(page, dataUiId(IDS.videoGallery), { timeout: 100000 });
    expect(await stableScreenshot(page)).toMatchSnapshot('video-gallery-with-one-speaker-participant.png');
  });

  /* @conditional-compile-remove(gallery-layouts) */
  test('VideoGallery can switch between modes', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Pupkin');
    vasily.isSpeaking = true;
    const participants = [vasily, paul];
    const initialState = defaultMockCallAdapterState(participants);

    page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    await waitForSelector(page, dataUiId(IDS.moreButton), { timeout: 100000 });
    await pageClick(page, dataUiId(IDS.moreButton));

    expect(await stableScreenshot(page)).toMatchSnapshot('gallery-controls.png');
    await page.locator('button:has-text("Gallery options")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('gallery-controls-open.png');
    await page.locator('button:has-text("Speaker layout")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('speaker-layout.png');
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("Gallery options")').click();
    await page.locator('button:has-text("Gallery layout")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('default-layout.png');
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("Gallery options")').click();
    await page.locator('button:has-text("Dynamic layout")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('floating-local-layout.png');
  });

  /* @conditional-compile-remove(gallery-layouts) */
  test('VideoGallery only renders screenshare stream in focused content', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Pupkin');
    addScreenshareStream(vasily, true);

    const participants = [paul, vasily];

    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("Gallery options")').click();
    await page.locator('button:has-text("Focused content")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('focused-content-layout.png');
  });

  /* @conditional-compile-remove(large-gallery) */
  test('VideoGallery should show correct number of tiles based on layout', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));

    const initialState = defaultMockCallAdapterState([]);
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true',
        mockRemoteParticipantCount: '65'
      })
    );

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('participant-cap-ovc.png');
    await page.locator('button:has-text("Gallery options")').click();
    await page.locator('button:has-text("Large Gallery")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('participant-cap-lg.png');
  });
});
