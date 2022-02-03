// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { clickOutsideOfPage, waitForPageFontsLoaded, waitForSelector, dataUiId } from '../common/utils';
import { test } from './fixture';
import { buildUrlWithMockAdapter } from './utils';
import { IDS } from '../common/constants';

test.describe('Page state tests', async () => {
  test('Page when waiting in lobby', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'lobby'
      })
    );
    // Click outside of page to turn away initial aria label
    await clickOutsideOfPage(page);
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('lobby-page.png');
  });
  test('Page when access is denied', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'accessDeniedTeamsMeeting'
      })
    );
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('access-denied-page.png');
  });
  test('Page when join call failed due to network', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'joinCallFailedDueToNoNetwork'
      })
    );
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('call-failed-due-to-network-page.png');
  });
  test('Page when local participant left call', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'leftCall'
      })
    );
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('left-call-page.png');
  });
  test('Page when local participant is removed from call', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        page: 'removedFromCall'
      })
    );
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('removed-from-call-page.png');
  });
});
