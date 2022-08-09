// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, waitForSelector, stableScreenshot, isTestProfileStableFlavor } from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('VideoGallery tests', async () => {
  test('VideoGallery Should have 1 Audio participant and one joining participant', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    vasily.isMuted = true;
    vasily.state = 'Connecting';

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'video-gallery-with-one-joining-gridview-participant.png'
    );
  });

  test.only('VideoGallery Should have 2 joining participants', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    paul.state = 'Connecting';
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');
    vasily.state = 'Ringing';

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'video-gallery-with-2-joining-gridview-participant.png'
    );
  });
});
