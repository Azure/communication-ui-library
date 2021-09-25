// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { stubMessageTimestamps, updatePageQueryParam, waitForChatCompositeToLoad } from '../common/utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  let originalUrls: string[];

  test.beforeEach(async ({ pages }) => {
    for (const page of pages) {
      originalUrls.push(page.url());

      // Load french locale for tests
      await updatePageQueryParam(page, { useFrlocale: 'true' });
    }
  });

  test.afterEach(async ({ pages }) => {
    for (let i = 0; i < pages.length; i++) {
      await pages[i].goto(originalUrls[i]);
    }
  });

  test('Participants list header should be localized', async ({ pages }) => {
    const page = pages[0];
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png', { threshold: 0.5 });
  });
});
