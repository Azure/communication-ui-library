// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import {
  chatTestSetup,
  sendMessage,
  waitForMessageSeen,
  waitForMessageWithContent
} from '../../common/chatTestHelpers';
import { stubMessageTimestamps, waitForChatCompositeToLoad } from '../../common/utils';
import { test } from './fixture';

test.describe('Chat Composite E2E Tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl });
  });

  test('composite pages load completely', async ({ pages }) => {
    const page = pages[0];
    if (!page) {
      throw new Error('Pages[0] not found');
    }
    expect(await page.screenshot()).toMatchSnapshot(`chat-screen.png`);
  });

  test('page[1] can rejoin the chat', async ({ pages }) => {
    const testMessageText = 'How the turn tables';
    const page1 = pages[1];
    if (!page1) {
      throw new Error('Pages[1] not found');
    }

    await sendMessage(page1, testMessageText);

    // Read the message to generate stable result
    await waitForMessageWithContent(page1, testMessageText);

    // Ensure message has been marked as seen
    await waitForMessageSeen(page1);

    await page1.reload({ waitUntil: 'networkidle' });
    await waitForChatCompositeToLoad(page1);
    // Fixme: We don't pull readReceipt when initial the chat again, this should be fixed in composite
    // await waitForSelector(page1, `[data-ui-status="seen"]`);
    await waitForMessageWithContent(page1, testMessageText);
    await stubMessageTimestamps(page1);
    // we are getting read receipt for previous messages, so the message here should be seen, otherwise it could cause flaky test
    await waitForMessageSeen(page1);
    expect(await page1.screenshot()).toMatchSnapshot('rejoin-thread.png');
  });
});
