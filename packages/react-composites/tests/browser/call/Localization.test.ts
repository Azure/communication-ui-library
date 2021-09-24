// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { waitForCallCompositeToLoad, loadCallScreen, updatePageQueryParam } from '../common/utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test.beforeEach(async ({ pages }) => {
    // Load french locale for tests
    for (const page of pages) {
      await updatePageQueryParam(page, { useFrlocale: 'true' });
    }
  });

  test('Configuration page title and participant button in call should be localized', async ({ pages }) => {
    const page = pages[0];

    await waitForCallCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-configuration-page.png', { threshold: 0.5 });

    await loadCallScreen([page]);
    expect(await page.screenshot()).toMatchSnapshot('localized-call-screen.png', { threshold: 0.5 });
  });
});
