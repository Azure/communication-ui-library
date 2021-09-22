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
    const configurationPageTitle = await page.waitForSelector(dataUiId('call-composite-configuration-page-title'));
    expect(await configurationPageTitle?.innerText()).toBe('Lancer un appel');
    await page.waitForSelector(dataUiId('call-composite-start-call-button'));
    await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
    await page.click(dataUiId('call-composite-start-call-button'));
    const participantsButton = await page.waitForSelector(dataUiId('call-composite-participants-button'));
    expect(await participantsButton?.innerText()).toBe('Personnes');
  });
});
