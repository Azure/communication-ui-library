// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { test } from './fixture';
import { dataUiId, gotoPage, stubMessageTimestamps, waitForCompositeToLoad } from '../utils';
import { expect } from '@playwright/test';

test.describe('Localization tests', async () => {
  test('Participants list header should be localized', async ({ serverUrl, users, page }) => {
    await gotoPage(page, serverUrl, users[0], { locale: 'fr-FR' });
    page.bringToFront();
    await waitForCompositeToLoad(page);
    stubMessageTimestamps(page);
    const participantListHeader = await page.waitForSelector(dataUiId('chat-composite-participant-list-header'));
    expect(await participantListHeader?.innerHTML()).toBe('Dans cette conversation');
  });
});
