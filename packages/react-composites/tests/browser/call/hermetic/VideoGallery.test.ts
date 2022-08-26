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
import { dataUiId, waitForSelector, stableScreenshot, isTestProfileStableFlavor } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('VideoGallery tests', async () => {
  test('VideoGallery Should have 1 Audio participant and one PSTN participant', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    vasily.isMuted = true;
    vasily.state = 'Connecting';

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    expect(await stableScreenshot(page)).toMatchSnapshot('video-gallery-with-one-joining-gridview-participant.png');
  });

  test('VideoGallery Should have 1 PSTN and 1 1-N participants', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    paul.state = 'Ringing';
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Connecting';

    const participants = [paul, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-gallery-with-2-joining-gridview-participant.png');
  });

  test('VideoGallery Should show the remote participant on hold', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    paul.state = 'Hold';
    const phoneUser = defaultMockRemotePSTNParticipant('+15555555555');
    phoneUser.state = 'Connecting';

    const participants = [paul, phoneUser];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot(
      'video-gallery-with-1-joining-1-hold-gridview-participant.png'
    );
  });
});
