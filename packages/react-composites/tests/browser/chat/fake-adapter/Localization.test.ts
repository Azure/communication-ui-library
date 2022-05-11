// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { stubMessageTimestamps, waitForChatCompositeToLoad } from '../../common/utils';
import { test } from '../fixture';
import { expect } from '@playwright/test';
import { BASE_CHAT_ADAPTER_MODEL, buildUrlForChatAppUsingFakeAdapter } from './fixture';

test.describe('Localization tests', async () => {
  test('Participants list header should be localized', async ({ serverUrl, page }) => {
    page.goto(buildUrlForChatAppUsingFakeAdapter(serverUrl, BASE_CHAT_ADAPTER_MODEL, { useFrLocale: 'true' }));
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png');
  });
});
