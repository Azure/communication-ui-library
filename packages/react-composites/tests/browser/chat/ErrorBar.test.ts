// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { stubMessageTimestamps, waitForChatCompositeToLoad, buildUrl } from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';
import { chatTestSetup, sendMessage, waitForSendMessageFailure, waitForMessageDelivered } from './chatTestHelpers';

const TEST_MESSAGE = 'No, sir, this will not do.';

test.describe('ErrorBar is shown correctly', async () => {
  test.beforeEach(async ({ pages, serverUrl }) => {
    await chatTestSetup({ pages, serverUrl });
  });

  test('not shown when nothing is wrong', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrl(serverUrl, users[0]));
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-valid-user.png');

    await sendMessage(page, TEST_MESSAGE);
    await waitForMessageDelivered(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-send-message-with-valid-user.png');
  });

  test('with wrong thread ID', async ({ page, serverUrl, users }) => {
    const user = users[0];
    user.threadId = 'INCORRECT_VALUE';
    await page.goto(buildUrl(serverUrl, users[0]));
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-wrong-thread-id.png');

    await sendMessage(page, TEST_MESSAGE);
    await waitForSendMessageFailure(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-wrong-thread-id.png');
  });

  test('with expired token', async ({ page, serverUrl, users }) => {
    const user = users[0];
    user.token = 'INCORRECT_VALUE' + user.token;
    await page.goto(buildUrl(serverUrl, users[0]));
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-expired-token.png');

    await sendMessage(page, TEST_MESSAGE);
    await waitForSendMessageFailure(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-expired-token.png');
  });

  test('with wrong endpoint', async ({ page, serverUrl, users }) => {
    const user = users[0];
    user.endpointUrl = 'https://INCORRECT.VALUE';
    await page.goto(buildUrl(serverUrl, users[0]));
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-wrong-endpoint-url.png');

    await sendMessage(page, TEST_MESSAGE);
    await waitForSendMessageFailure(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-wrong-endpoint-url.png');
  });
});
