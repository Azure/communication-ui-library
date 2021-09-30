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
    const page = await loadPageWithPermissionsForCalls(testBrowser, serverUrl, users[0], { useFrlocale: 'true' });
    await page.bringToFront();
    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });

    await loadCallScreen([page]);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
  });
});
