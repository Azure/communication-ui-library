// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { dataUiId, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { exec } from 'node:child_process';

/* @conditional-compile-remove(PSTN-calls) */
test.describe('Dtmf dialpad tests', async () => {
  test.beforeEach(async () => {
    await new Promise((r) => setTimeout(r, 2000));
    exec('free -m', (err, output) => {
      // once the command has completed, the callback function is called
      if (err) {
        // log and return if we encounter an error
        console.error('could not execute command: ', err);
        return;
      }
      // log the output received from the command
      console.log('RAM STATUS: \n', output);
    });
  });
  test('Dtmf dialpad should render in 1:1 PSTN call', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');

    const participant = [paul];
    const initialState = defaultMockCallAdapterState(participant);

    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, dataUiId('common-call-composite-more-button'));
    const moreButtonShowDialpadButton = await page.$('div[role="menu"] >> text="Show dialpad"');
    await moreButtonShowDialpadButton?.click();
    await waitForSelector(page, dataUiId('dialpadContainer'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`Call-Dtmf-Dialpad.png`);
  });
  test('Dtmf dialpad should not render in non-PSTN call', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();

    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('common-call-composite-more-button'));
    await pageClick(page, dataUiId('common-call-composite-more-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`Dtmf-Dialpad-Hidden-Non-PSTN.png`);
  });
});
