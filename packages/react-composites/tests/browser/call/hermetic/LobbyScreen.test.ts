// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import {
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockRemoteParticipant,
  defaultMockRemotePSTNParticipant,
  test
} from './fixture';
import { IDS } from '../../common/constants';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';

test.describe('Lobby page tests', async () => {
  test('Lobby page shows correct strings when joining a group call', async ({ page, serverUrl }) => {
    const dina = defaultMockRemoteParticipant('Dina');
    /**
     * remote participants reflect as this state for a moment before the user connects.
     *
     * Dina exists to demonstrate that we don't see the 'Calling' string when joining a group call as a flash.
     */
    dina.state = 'Idle';
    const participants = [dina];
    const initialState = defaultMockCallAdapterState(participants);

    if (initialState.call) {
      initialState.call.state = 'Connecting';
    }
    initialState.page = 'lobby';

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.lobbyScreenTitle));

    expect(await stableScreenshot(page)).toMatchSnapshot('lobby-page-group-call.png');
  });

  test('lobby page shows correct strings when starting a ACS outbound call', async ({ page, serverUrl }) => {
    const joel = defaultMockRemoteParticipant('Joel');
    joel.state = 'Connecting';
    const participants = [joel];
    const initialState = defaultMockCallAdapterState(participants);

    if (initialState.call) {
      initialState.call.state = 'Connecting';
    }
    initialState.page = 'lobby';

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.lobbyScreenTitle));

    expect(await stableScreenshot(page)).toMatchSnapshot('lobby-page-one-to-n-call.png');
  });

  test('lobby page shows correct strings when starting a PSTN outbound call', async ({ page, serverUrl }) => {
    const ellie = defaultMockRemotePSTNParticipant('15556667777');
    ellie.state = 'Ringing';
    const participants = [ellie];
    const initialState = defaultMockCallAdapterState(participants);

    if (initialState.call) {
      initialState.call.state = 'Connecting';
    }
    initialState.page = 'lobby';

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.lobbyScreenTitle));

    expect(await stableScreenshot(page)).toMatchSnapshot('lobby-page-pstn-call.png');
  });
});
