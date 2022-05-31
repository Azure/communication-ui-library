// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { stubMessageTimestamps, waitForChatCompositeToLoad } from '../../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';
import { DEFAULT_FAKE_CHAT_ADAPTER_ARGS, buildUrlForChatAppUsingFakeAdapter } from './fixture';

test.describe('Localization tests', async () => {
  test('Participants list header should be localized', async ({ serverUrl, page }) => {
    page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, { ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS, frenchLocaleEnabled: true })
    );
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png');
  });
});
