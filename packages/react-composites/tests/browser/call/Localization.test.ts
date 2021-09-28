// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { waitForCallCompositeToLoad, loadCallScreen, buildUrl } from '../common/utils';
import { expect } from '@playwright/test';
import { PAGE_VIEWPORT } from '../common/defaults';

test.describe('Localization tests', async () => {
  test('Configuration page title and participant button in call should be localized', async ({
    serverUrl,
    page,
    users
  }) => {
    // Load french locale for tests
    const url = buildUrl(serverUrl, users[0], { useFrlocale: 'true' });
    await page.bringToFront();
    await page.setViewportSize(PAGE_VIEWPORT);
    await page.goto(url, { waitUntil: 'load' });

    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });

    await loadCallScreen([page]);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
  });
});
