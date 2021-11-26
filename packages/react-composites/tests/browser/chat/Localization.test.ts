// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { stubMessageTimestamps, waitForChatCompositeToLoad } from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';
import { chatTestSetup } from './chatTestHelpers';

test.describe('Localization tests', async () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl, qArgs: { useFrLocale: 'true' } });
  });

  test('Participants list header should be localized', async ({ pages }) => {
    const page = pages[0];
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png');
  });
});
