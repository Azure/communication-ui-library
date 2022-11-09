// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { dataUiId, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';

/* @conditional-compile-remove(PSTN-calls) */
test.describe('Dtmf dialpad tests', async () => {
  test('Dtmf dialpad should render in 1:1 PSTN call', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');

    const participant = [paul];
    const initialState = defaultMockCallAdapterState(participant);

    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-with-chat-composite-more-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
    const moreButtonShowDialpadButton = await page.$('div[role="menu"] >> text="Show dialpad"');
    await moreButtonShowDialpadButton?.click();
    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-Dtmf-Dialpad.png`);
  });
  test('Dtmf dialpad should not render in non-PSTN call', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-with-chat-composite-more-button'));
    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`Dtmf-Dialpad-Hidden-Non-PSTN.png`);
  });
});
