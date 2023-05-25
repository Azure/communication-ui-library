// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  defaultMockRemotePSTNParticipant,
  test
} from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, waitForSelector, stableScreenshot, pageClick, isTestProfileMobile } from '../../common/utils';
/* @conditional-compile-remove(pinned-participants) */
import { screenshotOnFailure, perStepLocalTimeout } from '../../common/utils';
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
  test.only('Remote video tile pin menu button should be disabled when max remote video tiles are pinned', async ({
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
    // take snapshot to verify pin button is disabled
    expect(await stableScreenshot(page)).toMatchSnapshot('disabled-pin-menu-button.png');
  });
});
