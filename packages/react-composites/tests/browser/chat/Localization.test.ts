// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { buildUrl, stubMessageTimestamps, updatePageQueryParam, waitForChatCompositeToLoad } from '../common/utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test.beforeEach(async ({ pages }) => {
    for (const page of pages) {
      // Load french locale for tests
      await updatePageQueryParam(page, { useFrlocale: 'true' });
    }
  });

  test.afterEach(async ({ pages, users, serverUrl }) => {
    // Reset the page url that was changed during the tests
    for (let i = 0; i < pages.length; i++) {
      const url = buildUrl(serverUrl, users[i]);
      await pages[i].goto(url);
    }
  });

  test('Participants list header should be localized', async ({ pages }) => {
    const page = pages[0];
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png', { threshold: 0.5 });
  });
});
