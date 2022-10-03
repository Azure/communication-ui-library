// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import {
  stableScreenshot,
  waitForPageFontsLoaded,
  waitForSelector,
  dataUiId,
  isTestProfileStableFlavor
} from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';

test.describe('Page state tests', async () => {
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
  test('Page when local participant tries to join a room that cannot be not found', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'roomNotFound';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForPageFontsLoaded(page);
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('room-not-found-page.png');
  });
  test('Page when local participant tries to join a room that they are not invited to', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'deniedPermissionToRoom';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForPageFontsLoaded(page);
    await waitForSelector(page, dataUiId('call-composite-start-call-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('permission-denied-to-room-page.png');
  });
});
