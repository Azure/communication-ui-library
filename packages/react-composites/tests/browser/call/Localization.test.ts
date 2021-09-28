// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { waitForCallCompositeToLoad, loadCallScreen, buildUrl } from '../common/utils';
import { expect } from '@playwright/test';
import { PAGE_VIEWPORT } from '../common/defaults';
import { loadPageWithPermissionsForCalls } from '../common/fixtureHelpers';

test.describe('Localization tests', async () => {
  test('Configuration page title and participant button in call should be localized', async ({
    serverUrl,
    users,
    testBrowser
  }) => {
    console.log('item1');
    // TODO: in future this will use permissions set in the playwright config project settings
    const page = await loadPageWithPermissionsForCalls(testBrowser, serverUrl, users[0]);

    // Load french locale for tests
    console.log('item2');
    const url = buildUrl(serverUrl, users[0], { useFrlocale: 'true' });
    await page.bringToFront();
    console.log('item3');
    await page.setViewportSize(PAGE_VIEWPORT);
    console.log('item4');
    await page.goto(url, { waitUntil: 'load' });
    console.log('item5');

    await waitForCallCompositeToLoad(page);
    console.log('item6');
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });
    console.log('item7');

    await loadCallScreen([page], true);
    console.log('item8');
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
  });
});
