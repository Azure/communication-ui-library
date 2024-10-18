// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  addScreenshareStream,
  addVideoStream,
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

  test('Remote video tile mute menu button should be disabled when user is muted', async ({
    page,
    serverUrl
  }, testInfo) => {
    // @TODO: Test that pin menu item is disabled when maximum remote VideoTiles are pinned in VideoGallery when
    // drawer menu on long touch has been implemented
    test.skip(isTestProfileMobile(testInfo));
    const displayNames = ['Tony Hawk', 'Marie Curie', 'Gal Gadot', 'Margaret Atwood', 'Kobe Bryant', "Conan O'Brien"];
    const participants = displayNames.map((name) => defaultMockRemoteParticipant(name));
    for (const participant of participants) {
      participant.isMuted = true;
    }
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    const videoGallery = await waitForSelector(page, dataUiId(IDS.videoGallery));

    // skip the first tile because it is the local video tile
    const videoTile = await videoGallery.waitForSelector(dataUiId(IDS.videoTile) + ` >> nth=1`);
    await videoTile.hover();
    const moreButton = await videoTile.waitForSelector(dataUiId(IDS.videoTileMoreOptionsButton));
    await moreButton.click();
    await waitForSelector(page, dataUiId('video-tile-mute-participant'));
    // take snapshot to verify mute button is disabled
    expect(await stableScreenshot(page)).toMatchSnapshot('disabled-mute-menu-button.png');
  });
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

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-gallery-with-one-speaker-participant.png');
  });

  test('VideoGallery can switch between modes', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Pupkin');
    vasily.isSpeaking = true;
    const participants = [vasily, paul];
    const initialState = defaultMockCallAdapterState(participants);

    page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));

    expect(await stableScreenshot(page)).toMatchSnapshot('gallery-controls.png');
    await page.locator('button:has-text("View")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('gallery-controls-open.png');
    await page.locator('button:has-text("Speaker")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('speaker-layout.png');
    /* @conditional-compile-remove(gallery-layout-composite) */
    await pageClick(page, dataUiId(IDS.moreButton));
    /* @conditional-compile-remove(gallery-layout-composite) */
    await page.locator('button:has-text("View")').click();
    /* @conditional-compile-remove(gallery-layout-composite) */
    await page.locator('button:has-text("Gallery view")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('default-layout.png');
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('button:has-text("View")').click();
    await page.locator('button:has-text("Dynamic")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('floating-local-layout.png');
  });

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
    await page.locator('button:has-text("View")').click();
    await page.locator('button:has-text("Focus on content")').click();
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
    await page.locator('button:has-text("View")').click();
    await page.locator('button:has-text("Large Gallery")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('participant-cap-lg.png');
  });

  /* @conditional-compile-remove(gallery-layout-composite) */
  test('VideoGallery layouts looks correct on mobile', async ({ page, serverUrl }, testInfo) => {
    test.skip(!isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Pupkin');
    const jerry = defaultMockRemoteParticipant('Jerry Seinfeld');
    const bob = defaultMockRemoteParticipant('Bob Ross');
    const tom = defaultMockRemoteParticipant('Tom Hanks');
    const sheryl = defaultMockRemoteParticipant('Sheryl Sandberg');
    const joseph = defaultMockRemoteParticipant('Joseph Johnson');
    const participants = [paul, vasily, jerry, bob, tom, sheryl, joseph];
    addVideoStream(paul, true);
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        newControlBarExperience: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.moreButton));
    expect(await stableScreenshot(page)).toMatchSnapshot('dynamic-layout-mobile.png');
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('span:has-text("View")').click();
    await page.locator('span:has-text("Gallery")').click();
    expect(await stableScreenshot(page)).toMatchSnapshot('default-layout-mobile.png');
  });

  test('Gallery layouts vailable on mobile are correct', async ({ page, serverUrl }, testInfo) => {
    test.skip(!isTestProfileMobile(testInfo));
    const paul = defaultMockRemoteParticipant('Paul Bridges');

    const initialState = defaultMockCallAdapterState([paul]);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));
    await page.locator('span:has-text("View")');
    await page.locator('span:has-text("View")').click();
    await page.locator('div[role=menuitem]').first().focus();
    expect(await stableScreenshot(page)).toMatchSnapshot('gallery-options-mobile.png');
  });
});
