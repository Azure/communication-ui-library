// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from '../common/constants';
import { dataUiId, stubMessageTimestamps, waitForChatCompositeToLoad, waitForSelector } from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';
import {
  chatTestSetup,
  sendMessage,
  waitForMessageDelivered,
  waitForMessageSeen,
  waitForMessageWithContent
} from './chatTestHelpers';

test.describe('Chat Composite E2E Tests', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl });
  });

  test('composite pages load completely', async ({ pages }) => {
    expect(await pages[0].screenshot()).toMatchSnapshot(`chat-screen.png`);
  });

  test('page[1] can receive message and send readReceipt when page[0] send message', async ({ pages }) => {
    const testMessageText = 'How the turn tables';
    const page0 = pages[0];
    await page0.bringToFront();
    await sendMessage(page0, testMessageText);
    await waitForMessageDelivered(page0);
    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('sent-messages.png');

    const page1 = pages[1];
    await page1.bringToFront();
    await waitForMessageWithContent(page1, testMessageText);

    // It could be too slow to get typing indicator here, which makes the test flakey
    // so wait for typing indicator disappearing, @Todo: stub out typing indicator instead.
    await page1.waitForTimeout(1000); // ensure typing indicator has had time to appear
    const typingIndicator = await page1.$(dataUiId(IDS.typingIndicator));
    typingIndicator && (await typingIndicator.waitForElementState('hidden')); // ensure typing indicator has now disappeared

    await stubMessageTimestamps(page1);
    expect(await page1.screenshot()).toMatchSnapshot('received-messages.png');

    await page0.bringToFront();
    await waitForMessageSeen(page0);
    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('read-message-status.png');
  });

  test('page[0] can view typing indicator within 10s', async ({ pages, users }) => {
    const page0 = pages[0];
    const page1 = pages[1];

    await page1.bringToFront();
    await page1.type(dataUiId(IDS.sendboxTextField), 'I am not superstitious. Just a little stitious.');
    await page0.bringToFront();
    await waitForSelector(page0, dataUiId(IDS.typingIndicator));
    const indicator0 = await page0.$(dataUiId(IDS.typingIndicator));

    expect(await indicator0?.innerHTML()).toContain(users[1].displayName);
    expect(await pages[0].screenshot()).toMatchSnapshot('typing-indicator.png');

    await page0.bringToFront();
    // Advance time by 10 seconds to make typingindicator go away
    await page0.evaluate(() => {
      const currentDate = new Date();
      currentDate.setSeconds(currentDate.getSeconds() + 10);
      Date.now = () => currentDate.getTime();
    });
    await page0.waitForTimeout(1000);
    const indicator1 = await page0.$(dataUiId(IDS.typingIndicator));
    expect(await indicator1?.innerHTML()).toBeFalsy();
    expect(await page0.screenshot()).toMatchSnapshot('typing-indicator-disappears.png');
  });

  test('page[1] can rejoin the chat', async ({ pages }) => {
    const testMessageText = 'How the turn tables';
    const page1 = pages[1];
    await page1.bringToFront();
    await sendMessage(page1, testMessageText);

    // Read the message to generate stable result
    await pages[0].bringToFront();
    await waitForMessageWithContent(page1, testMessageText);

    // Ensure message has been marked as seen
    await page1.bringToFront();
    await waitForMessageSeen(page1);

    await page1.reload({ waitUntil: 'networkidle' });
    await waitForChatCompositeToLoad(page1);
    // Fixme: We don't pull readReceipt when initial the chat again, this should be fixed in composite
    // await waitForSelector(page1, `[data-ui-status="seen"]`);
    await waitForMessageWithContent(page1, testMessageText);
    await stubMessageTimestamps(page1);
    expect(await page1.screenshot()).toMatchSnapshot('rejoin-thread.png');
  });
});

test.describe('Chat Composite custom data model', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl, qArgs: { customDataModel: 'true' } });
  });

  test('can be viewed by user[1]', async ({ pages }) => {
    const testMessageText = 'How the turn tables';
    const page = pages[0];
    await page.bringToFront();
    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    await waitForSelector(page, '#custom-data-model-typing-indicator');
    await waitForSelector(page, '#custom-data-model-message');
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('custom-data-model.png');
  });
});
