// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { waitForCallCompositeToLoad, loadCallScreen, updatePageQueryParam, buildUrl } from '../common/utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test.afterEach(async ({ pages, users, serverUrl }) => {
    // Reset the page url that was changed during the tests
    for (let i = 0; i < pages.length; i++) {
      const url = buildUrl(serverUrl, users[i]);
      await pages[i].goto(url);
    }
  });

  test('Configuration page title and participant button in call should be localized', async ({ pages }) => {
    const page = pages[0];

    // Load french locale for tests
    await updatePageQueryParam(page, { useFrlocale: 'true' });

    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });

    await loadCallScreen([page]);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
  });
});
