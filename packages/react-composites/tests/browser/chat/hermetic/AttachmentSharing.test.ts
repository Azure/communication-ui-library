// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { stableScreenshot } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';

/* @conditional-compile-remove(file-sharing-acs) */
test.describe('Filesharing Attach file icon', async () => {
  test('is not visible if filesharing options are undefined', async ({ serverUrl, page }) => {
    await page.goto(buildUrlForChatAppUsingFakeAdapter(serverUrl, DEFAULT_FAKE_CHAT_ADAPTER_ARGS));
    expect(
      await stableScreenshot(page, { stubMessageTimestamps: true, dismissChatMessageActions: true })
    ).toMatchSnapshot('filesharing-attach-file-icon-not-visible.png');
  });

  test('is visible if filesharing options are defined', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, { ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS, fileSharingEnabled: true })
    );
    expect(
      await stableScreenshot(page, { stubMessageTimestamps: true, dismissChatMessageActions: true })
    ).toMatchSnapshot('filesharing-attach-file-icon-visible.png');
  });
});
