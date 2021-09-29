// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { loadPageWithPermissionsForCalls, waitForCallCompositeToLoad, loadCallScreen } from '../common/utils';
import { expect } from '@playwright/test';
import { v1 as generateGUID } from 'uuid';

test.describe('Localization tests', async () => {
  test('Configuration page title and participant button in call should be localized', async ({
    serverUrl,
    users,
    testBrowser
  }) => {
    // Run this test in an isolated thread to ensure the test is totally isolated.
    const newCallId = generateGUID();
    const page = await loadPageWithPermissionsForCalls(
      testBrowser,
      serverUrl,
      { ...users[0], threadId: newCallId },
      { useFrlocale: 'true' }
    );
    await page.bringToFront();
    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });

    await loadCallScreen([page]);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
  });
});
