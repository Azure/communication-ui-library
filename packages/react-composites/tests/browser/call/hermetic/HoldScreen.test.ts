// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { dataUiId, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';

test.describe('Hold screen tests', async () => {
  test('Hold screen should render correctly', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));

    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-screen-morebutton-open.png`);

    await waitForSelector(page, dataUiId(IDS.holdButton));
    await pageClick(page, dataUiId(IDS.holdButton));
    initialState.page = 'hold';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.holdPage));

    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-hold-screen.png`);
  });

  test('Hold screen should return to call screen upon resume', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.moreButton));
    await pageClick(page, dataUiId(IDS.moreButton));

    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-screen-morebutton-open.png`);

    await waitForSelector(page, dataUiId(IDS.holdButton));
    await pageClick(page, dataUiId(IDS.holdButton));
    initialState.page = 'hold';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.holdPage));

    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-hold-screen.png`);

    await waitForSelector(page, dataUiId(IDS.resumeCallButton));
    await pageClick(page, dataUiId(IDS.resumeCallButton));

    initialState.page = 'call';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.callPage));

    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-screen-resumed.png`);
  });
});
