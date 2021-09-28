// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { waitForCallCompositeToLoad, dataUiId, buildUrl, loadCallScreen } from '../common/utils';
import { expect } from '@playwright/test';
import { loadPageWithPermissionsForCalls } from '../common/fixtureHelpers';

test.describe('Localization tests', async () => {
  test('Configuration page title and participant button in call should be localized', async ({
    serverUrl,
    users,
    testBrowser
  }) => {
    // TODO: in future this will use permissions set in the playwright config project settings
    const page = await loadPageWithPermissionsForCalls(testBrowser, serverUrl, users[0]);

    // Load french locale for tests
    const url = buildUrl(serverUrl, users[0], { useFrLocale: 'true' });
    await page.bringToFront();
    await page.goto(url, { waitUntil: 'load' });

    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });

    await page.bringToFront();
    await page.click(dataUiId('call-composite-start-call-button'));
    await loadCallScreen([page]);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
  });
});
