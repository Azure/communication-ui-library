// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from '../common/constants';
import {
  dataUiId,
  stubMessageTimestamps,
  stubReadReceiptsToolTip,
  waitForChatCompositeToLoad,
  waitForFunction,
  waitForSelector
} from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';
import {
  chatTestSetup,
  sendMessage,
  waitForMessageDelivered,
  waitForMessageSeen,
  waitForMessageWithContent,
  waitForTypingIndicatorHidden
} from '../common/chatTestHelpers';

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
    await sendMessage(page0, testMessageText);
    await waitForMessageDelivered(page0);
    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('sent-messages.png');

    const page1 = pages[1];
    await waitForMessageWithContent(page1, testMessageText);
    await waitForTypingIndicatorHidden(page1);

    await stubMessageTimestamps(page1);
    expect(await page1.screenshot()).toMatchSnapshot('received-messages.png');
    await waitForMessageSeen(page0);

    await stubMessageTimestamps(page0);
    await page0.locator(dataUiId('chat-composite-message-status-icon')).click();
    await page0.waitForSelector(dataUiId('chat-composite-message-tooltip'));
    await stubReadReceiptsToolTip(page0);
    expect(await page0.screenshot()).toMatchSnapshot('read-message-tooltip-text.png');
  });

  test('page[0] can receive read receipt from page[1] and show it in contextual menu', async ({ pages }) => {
    const testMessageText = 'How the turn tables';
    const page0 = pages[0];
    await sendMessage(page0, testMessageText);
    await waitForMessageDelivered(page0);
    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('sent-messages.png');

    const page1 = pages[1];
    await waitForMessageWithContent(page1, testMessageText);
    await waitForTypingIndicatorHidden(page1);
    await stubMessageTimestamps(page1);
    await page0.locator(dataUiId('chat-composite-message')).click();
    await page0.locator(dataUiId('chat-composite-message-action-icon')).click();
    await page0.waitForSelector('[id="chat-composite-message-contextual-menu"]');
    await page0.locator(dataUiId('chat-composite-message-contextual-menu-read-info')).click();
    await page0.waitForSelector('[id="chat-composite-message-contextual-menu-read-name-list"]');
    expect(await page0.screenshot()).toMatchSnapshot('read-message-contextualMenu.png');
  });

  test('page[0] can view typing indicator within 10s', async ({ pages, users }) => {
    const page0 = pages[0];

    const page1 = pages[1];
    await page1.type(dataUiId(IDS.sendboxTextField), 'I am not superstitious. Just a little stitious.');
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

test.describe('Chat Composite custom data model', () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl, qArgs: { customDataModel: 'true' } });
  });

  test('can be viewed by user[1]', async ({ pages }) => {
    const testMessageText = 'How the turn tables';
    const page = pages[0];
    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    // Participant list is a beta feature
    if (process.env['COMMUNICATION_REACT_FLAVOR'] !== 'stable') {
      await waitForFunction(page, () => {
        return document.querySelectorAll('[data-ui-id="chat-composite-participant-custom-avatar"]').length === 3;
      });
    }
    await waitForSelector(page, '#custom-data-model-typing-indicator');
    await waitForSelector(page, '#custom-data-model-message');
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('custom-data-model.png');
  });
});
