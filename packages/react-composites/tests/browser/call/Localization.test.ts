// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { waitForCallCompositeToLoad, dataUiId, buildUrl } from '../common/utils';
import { expect } from '@playwright/test';
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
    const url = buildUrl(serverUrl, users[0], { useFrLocale: 'true' });
    await page.bringToFront();
    console.log('item3');
    console.log('item4');
    await page.goto(url, { waitUntil: 'load' });
    console.log('item5');

    await waitForCallCompositeToLoad(page);
    console.log('item6');
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });
    console.log('item7');

    console.log('item8');
    await page.bringToFront();
    console.log('item9');
    await page.click(dataUiId('call-composite-start-call-button'));
    console.log('item10');
    // await loadCallScreen([page], true);
    page.waitForTimeout(10000);
    console.log('item11');
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
    console.log('item12');
  });
});
