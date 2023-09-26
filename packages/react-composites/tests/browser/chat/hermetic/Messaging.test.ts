// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { sendMessage, waitForMessageDelivered } from '../../common/chatTestHelpers';
import { stableScreenshot, waitForChatCompositeToLoad } from '../../common/utils';
import { test } from './fixture';

const TEST_MESSAGE = 'No, sir, this will not do.';

test.describe('Tests related to messaging', async () => {
  test.beforeEach(async () => await new Promise((r) => setTimeout(r, 2000)));
  test('Local participant should see their message in thread', async ({ page }) => {
    await waitForChatCompositeToLoad(page);
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      'no-messages-in-chat-thread.png'
    );

    await sendMessage(page, TEST_MESSAGE);
    await waitForMessageDelivered(page);
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot(
      'one-message-in-chat-thread.png'
    );
  });
});
