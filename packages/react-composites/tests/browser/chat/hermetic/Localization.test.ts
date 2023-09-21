// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { stableScreenshot, waitForChatCompositeToLoad } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';

test.describe('Localization tests', async () => {
  test('Participants list header should be localized', async ({ serverUrl, page }) => {
    page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, { ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS, frenchLocaleEnabled: true })
    );
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('localized-chat.png');
  });
});
