// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { dataUiId, loadCallCompositePage, waitForCallCompositeToLoad } from '../utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test('Configuration page title and participant button in call should be localized', async ({
    serverUrl,
    users,
    testBrowser
  }) => {
    const page = await loadCallCompositePage(testBrowser, serverUrl, users[0], { useFrlocale: 'true' });
    page.bringToFront();
    await waitForCallCompositeToLoad(page);
    await page.waitForSelector(dataUiId('call-composite-start-call-button'));
    await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
    await page.waitForTimeout(1000);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });
    await page.click(dataUiId('call-composite-start-call-button'));
    await page.waitForTimeout(1000);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
  });
});
