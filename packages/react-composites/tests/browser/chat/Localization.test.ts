// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { stubMessageTimestamps, waitForChatCompositeToLoad, buildUrl } from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';
import { chatTestSetup } from './chatTestHelpers';

test.describe('Localization tests', async () => {
  test.beforeEach(async ({ pages, serverUrl }) => {
    await chatTestSetup({ pages, serverUrl });
  });

  test('Participants list header should be localized', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrl(serverUrl, users[0], { useFrLocale: 'true' }));
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png');
  });
});
