// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { dataUiId, isTestProfileStableFlavor, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';

test.describe('Hold screen tests', async () => {
  test('Hold screen should render correctly', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId('call-with-chat-composite-more-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
    const moreButtonHoldButton = await page.$('div[role="menuitem"] >> text=Hold call');
    await moreButtonHoldButton?.click();

    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-hold-screen.png`);
  });

  test.only('Hold screen should return to call screen upon resume', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId('call-with-chat-composite-more-button'));

    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
    const moreButtonHoldButton = await page.$('div[role="menuitem"] >> text=Hold call');
    await moreButtonHoldButton?.click();

    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-hold-screen.png`);

    await waitForSelector(page, dataUiId('hold-page-resume-call-button'));
    await pageClick(page, dataUiId('hold-page-resume-call-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-screen-resumed.png`);
  });
});
