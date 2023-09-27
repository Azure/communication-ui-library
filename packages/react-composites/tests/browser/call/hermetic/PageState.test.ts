// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { stableScreenshot, waitForPageFontsLoaded, waitForSelector, dataUiId } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { exec } from 'node:child_process';

test.describe('Page state tests', async () => {
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
  test('Page when waiting in lobby', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'lobby';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('lobby-page.png');
  });
  test('Page when access is denied', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'accessDeniedTeamsMeeting';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('access-denied-page.png');
  });
  test('Page when join call failed due to network', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'joinCallFailedDueToNoNetwork';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('call-failed-due-to-network-page.png');
  });
  test('Page when local participant left call', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'leftCall';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('left-call-page.png');
  });
  test('Page when local participant is removed from call', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'removedFromCall';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForPageFontsLoaded(page);
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('removed-from-call-page.png');
  });

  /* @conditional-compile-remove(rooms) */
  test('Page when local participant tries to join a room that cannot be not found', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'roomNotFound';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForPageFontsLoaded(page);
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('room-not-found-page.png');
  });

  /* @conditional-compile-remove(rooms) */
  test('Page when local participant tries to join a room that they are not invited to', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'deniedPermissionToRoom';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForPageFontsLoaded(page);
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('permission-denied-to-room-page.png');
  });
});
