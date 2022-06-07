// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { stableScreenshot, waitForPageFontsLoaded, waitForSelector, dataUiId } from '../common/utils';
import { test } from './fixture';
import { buildUrlWithMockAdapter } from './utils';

test.describe('Page state tests', async () => {
  test('Page when waiting in lobby', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'lobby'
      })
    );
    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('lobby-page.png');
  });
  test('Page when access is denied', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'accessDeniedTeamsMeeting'
      })
    );
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('access-denied-page.png');
  });
  test('Page when join call failed due to network', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'joinCallFailedDueToNoNetwork'
      })
    );
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'call-failed-due-to-network-page.png'
    );
  });
  test('Page when local participant left call', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'leftCall'
      })
    );
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('left-call-page.png');
  });
  test('Page when local participant is removed from call', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'removedFromCall'
      })
    );
    await waitForPageFontsLoaded(page);
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('removed-from-call-page.png');
  });
});
