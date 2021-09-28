// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { buildUrl, stubMessageTimestamps, waitForChatCompositeToLoad } from '../common/utils';
import { expect } from '@playwright/test';
import { PAGE_VIEWPORT } from '../common/defaults';

test.describe('Localization tests', async () => {
  test('Participants list header should be localized', async ({ serverUrl, page, users }) => {
    // Load french locale for tests
    const url = buildUrl(serverUrl, users[0], { useFrLocale: 'true' });
    await page.setViewportSize(PAGE_VIEWPORT);
    await page.goto(url, { waitUntil: 'load' });

    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png', { threshold: 0.5 });
  });
});
