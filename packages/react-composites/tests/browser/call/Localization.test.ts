// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { loadPageWithPermissionsForCalls, waitForCallCompositeToLoad, loadCallScreen } from '../common/utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test.beforeEach(async ({ pages }) => {
    for (const page of pages) {
      // Ensure any previous call users from prior tests have left the call
      await page.reload();
    }
  });

  test('Configuration page title and participant button in call should be localized', async ({
    serverUrl,
    users,
    testBrowser
  }) => {
    console.log('locale test 1');
    const page = await loadPageWithPermissionsForCalls(testBrowser, serverUrl, users[0], { useFrlocale: 'true' });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`PAGE2 CONSOLE ERROR TEXT: "${msg.text()}"`);
      }
    });
    console.log('locale test 2');
    await page.bringToFront();
    console.log('locale test 3');
    await waitForCallCompositeToLoad(page);
    console.log('locale test 4');
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });
    console.log('locale test 5');

    await loadCallScreen([page]);
    console.log('locale test 6');
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
    console.log('locale test 7');
  });
});
