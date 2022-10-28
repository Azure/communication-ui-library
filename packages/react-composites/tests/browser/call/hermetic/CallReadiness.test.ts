// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterStateCallReadiness, test } from './fixture';
import { expect, Page } from '@playwright/test';
import {
  dataUiId,
  isTestProfileMobile,
  isTestProfileStableFlavor,
  pageClick,
  stableScreenshot,
  waitForPageFontsLoaded,
  waitForSelector
} from '../../common/utils';

test.describe('Call Readiness tests', async () => {
  test('Configuration page should show enable camera/mic button when camera and mic permissions are not set', async ({
    page,
    serverUrl
  }) => {
    test.skip(isTestProfileStableFlavor());

    const initialState = defaultMockCallAdapterStateCallReadiness();
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        useCallReadiness: 'true',
        customCallCompositeOptions: JSON.stringify({ callReadinessOptedIn: true })
      })
    );

    await waitForCallCompositeToLoad_CallReadiness(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-enable-device-permission.png`);
  });

  test('Clicking on enable camera/mic button should show modal on Desktop', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileStableFlavor());
    test.skip(isTestProfileMobile(testInfo));
    const initialState = defaultMockCallAdapterStateCallReadiness();
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        useCallReadiness: 'true',
        customCallCompositeOptions: JSON.stringify({ callReadinessOptedIn: true })
      })
    );

    await waitForCallCompositeToLoad_CallReadiness(page);
    await waitForSelector(page, dataUiId('permission-dropdown'));
    await pageClick(page, dataUiId('permission-dropdown') + ' >> nth=0');
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-desktop-helper-modal.png`);
  });

  test('Call Readiness error bar should show up when user deny permissions', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const initialState = defaultMockCallAdapterStateCallReadiness();
    initialState.devices.deviceAccess = { video: false, audio: false };
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        useCallReadiness: 'true',
        customCallCompositeOptions: JSON.stringify({ callReadinessOptedIn: true })
      })
    );

    await waitForCallCompositeToLoad_CallReadiness(page);

    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-error-bar.png`);
  });

  test('Call Readiness feature should be hidden when not opted in', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const initialState = defaultMockCallAdapterStateCallReadiness();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForCallCompositeToLoad_CallReadiness(page);

    expect(await stableScreenshot(page)).toMatchSnapshot(
      `call-composite-config-screen-with-call-readiness-opted-out.png`
    );
  });
});

const waitForCallCompositeToLoad_CallReadiness = async (page: Page): Promise<void> => {
  await page.bringToFront();
  await page.waitForLoadState('load');
  await waitForPageFontsLoaded(page);
};
