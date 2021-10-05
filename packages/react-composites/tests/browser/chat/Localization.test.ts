// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { loadUrlInPage, stubMessageTimestamps, waitForChatCompositeToLoad } from '../common/utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test('Participants list header should be localized', async ({ serverUrl, users, page }) => {
    await loadUrlInPage(page, serverUrl, users[0], { useFrLocale: 'true' });
    page.bringToFront();
    await waitForChatCompositeToLoad(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png');
  });
});
