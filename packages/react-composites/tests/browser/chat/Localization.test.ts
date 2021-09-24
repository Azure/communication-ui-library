// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { stubMessageTimestamps, updatePageQueryParam, waitForChatCompositeToLoad } from '../common/utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test.beforeEach(async ({ pages }) => {
    // Load french locale for tests
    for (const page of pages) {
      await updatePageQueryParam(page, { useFrlocale: 'true' });
    }
  });

  test('Participants list header should be localized', async ({ pages }) => {
    const page = pages[0];
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png', { threshold: 0.5 });
  });
});
