// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { stubMessageTimestamps, waitForChatCompositeToLoad } from '../../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';
import { FAKE_CHAT_ADAPTER_ARGS, buildUrlForChatAppUsingFakeAdapter } from './fixture';

test.describe('Localization tests', async () => {
  test('Participants list header should be localized', async ({ serverUrl, page }) => {
    page.goto(buildUrlForChatAppUsingFakeAdapter(serverUrl, FAKE_CHAT_ADAPTER_ARGS, { useFrLocale: 'true' }));
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png');
  });
});
