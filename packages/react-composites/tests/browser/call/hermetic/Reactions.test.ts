// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, isTestProfileMobile, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';
import { MockCallAdapterState } from 'common';

test.describe('Reactions button tests', async () => {
  test('Reactions button sub menu appears when button is clicked', async ({ page, serverUrl }, testInfo) => {
    const Paul = defaultMockRemoteParticipant('Paul Blurt');
    const Adam = defaultMockRemoteParticipant('Adam Sandler');
    const Loki = defaultMockRemoteParticipant('Loki Odinson');

    const participants = [Paul, Adam, Loki];

    const initialState = defaultMockCallAdapterState(participants);

    initialState.reactions = {
      likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 51 },
      heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 51 },
      laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 51 },
      applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 51 },
      surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 51 }
    };

    // Future Note: We should run tests to see reaction button with two or three reaction enojis

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    if (isTestProfileMobile(testInfo)) {
      await waitForSelector(page, dataUiId(IDS.moreButton));
      await page.click(dataUiId(IDS.moreButton));
      await waitForSelector(page, dataUiId(IDS.reactionMobileDrawerMenuItem));
      expect(await stableScreenshot(page)).toMatchSnapshot('reaction-sub-menu-in-ongoing-call-in-mobile.png');
    } else {
      await waitForSelector(page, dataUiId(IDS.reactionButton));
      await page.click(dataUiId(IDS.reactionButton));
      await waitForSelector(page, dataUiId(IDS.reactionButtonSubMenu));
      expect(await stableScreenshot(page)).toMatchSnapshot('reaction-sub-menu-in-ongoing-call-in-desktop.png');
    }
  });

  test('Reactions button should not appear when capability is false', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const Paul = defaultMockRemoteParticipant('Paul Blurt');
    const Adam = defaultMockRemoteParticipant('Adam Sandler');
    const Loki = defaultMockRemoteParticipant('Loki Odinson');

    const participants = [Paul, Adam, Loki];

    const initialState: MockCallAdapterState = defaultMockCallAdapterState(
      participants,
      'Presenter',
      false,
      undefined,
      true
    );

    initialState.reactions = {
      likeReaction: { url: 'assets/reactions/likeEmoji.png', frameCount: 51 },
      heartReaction: { url: 'assets/reactions/heartEmoji.png', frameCount: 51 },
      laughReaction: { url: 'assets/reactions/laughEmoji.png', frameCount: 51 },
      applauseReaction: { url: 'assets/reactions/clapEmoji.png', frameCount: 51 },
      surprisedReaction: { url: 'assets/reactions/surprisedEmoji.png', frameCount: 51 }
    };

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    expect(await stableScreenshot(page)).toMatchSnapshot('reaction-sub-menu-capability-false.png');
  });
});
