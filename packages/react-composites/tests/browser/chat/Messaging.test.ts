// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { stubMessageTimestamps, waitForChatCompositeToLoad, buildUrl, stringifyChatModel } from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';
import { sendMessage, waitForMessageDelivered } from '../common/chatTestHelpers';

const TEST_MESSAGE = 'No, sir, this will not do.';

test.describe('Tests related to messaging', async () => {
  test('Local participant should see their message in thread', async ({ serverUrl, users, page }) => {
    await page.goto(
      buildUrl(serverUrl, users[0], {
        fakeChatAdapterModel: stringifyChatModel(users)
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-valid-user.png');

    await sendMessage(page, TEST_MESSAGE);
    await waitForMessageDelivered(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-send-message-with-valid-user.png');
  });
});
