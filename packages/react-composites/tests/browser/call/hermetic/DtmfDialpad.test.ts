// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { dataUiId, isTestProfileStableFlavor, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';

test.describe('Dtmf dialpad tests', async () => {
  test('Dtmf dialpad should render correctly', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const vasily = defaultMockRemoteParticipant('Vasily Podkolzin');

    const participants = [paul, vasily];
    const initialState = defaultMockCallAdapterState(participants);

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId('call-with-chat-composite-more-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
    const moreButtonShowDialpadButton = await page.$('div[role="menu"] >> text="Show Dialpad"');
    await moreButtonShowDialpadButton?.click();
    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-Dtmf-Dialpad.png`);
  });
});
