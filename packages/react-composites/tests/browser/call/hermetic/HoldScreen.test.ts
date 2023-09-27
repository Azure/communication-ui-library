// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { dataUiId, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { exec } from 'node:child_process';

/* @conditional-compile-remove(PSTN-calls) @conditional-compile-remove(one-to-n-calling) */
test.describe('Hold screen tests', async () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    let freeRam = 0;
    while (freeRam < 1000) {
      exec("free -m | awk 'NR==2 {print $4}'", (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
          // log and return if we encounter an error
          console.error('could not execute command: ', err);
          return;
        }
        // log the output received from the command
        console.log(`Free RAM during test ${JSON.stringify(testInfo.title)}: \n`, output);
        freeRam = parseInt(output);
      });
      if (freeRam >= 1000) {
        return;
      }
      console.log(`${freeRam}MB is not enough RAM for test ${JSON.stringify(testInfo.title)}. Waiting 10s...\n`);
      await new Promise((r) => setTimeout(r, 10000));
    }
  });
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
