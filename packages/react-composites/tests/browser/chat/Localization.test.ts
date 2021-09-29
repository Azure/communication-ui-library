// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { stubMessageTimestamps, waitForChatCompositeToLoad } from '../common/utils';
import { expect } from '@playwright/test';
import { loadPageForUser } from '../common/fixtureHelpers';

test.describe('Localization tests', async () => {
  test('Participants list header should be localized', async ({ serverUrl, users, page }) => {
    await loadPageForUser(page, serverUrl, users[0], { useFrLocale: 'true' });
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png');
  });
});
