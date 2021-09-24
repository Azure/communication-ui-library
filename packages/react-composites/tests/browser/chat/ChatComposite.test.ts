// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IDS } from '../common/config';
import {
  dataUiId,
  stubMessageTimestamps,
  updatePageQueryParam,
  waitForChatCompositeParticipantsToLoad,
  waitForChatCompositeToLoad
} from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';

// All tests in this suite *must be run sequentially*.
// The tests are not isolated, each test depends on the final-state of the chat thread after previous tests.
//
// We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
// many threads using the same connection string in a short span of time.
test.describe('Chat Composite E2E Tests', () => {
  test.beforeEach(async ({ pages }) => {
    for (const page of pages) {
      await waitForChatCompositeToLoad(page);
      await waitForChatCompositeParticipantsToLoad(page, 2);
      await stubMessageTimestamps(page);
    }
  });

  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await pages[idx].waitForSelector(dataUiId(IDS.sendboxTextfield));
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-chat-screen.png`);
    }
  });

  test('page[1] can receive message and send readReceipt when page[0] send message', async ({ pages }) => {
    const page0 = pages[0];
    await page0.bringToFront();
    await page0.type(dataUiId(IDS.sendboxTextfield), 'How the turn tables');
    await page0.keyboard.press('Enter');
    await page0.waitForSelector(`[data-ui-status="delivered"]`);
    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('send-message.png');

    const page1 = pages[1];
    await page1.bringToFront();
    await page1.waitForSelector(`[data-ui-status="delivered"]`);
    await stubMessageTimestamps(page1);

    // It could be too slow to get typing indicator here, which makes the test flakey
    // so wait for typing indicator disappearing
    const typingIndicator = await page1.$(dataUiId(IDS.typingIndicator));
    typingIndicator && (await typingIndicator.waitForElementState('hidden'));

    expect(await page1.screenshot()).toMatchSnapshot('receive-message.png');

    await page0.bringToFront();
    await page0.waitForSelector(`[data-ui-status="seen"]`);
    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('read-message-status.png');
  });

  test('page[0] can view typing indicator within 10s', async ({ pages, users }) => {
    const page0 = pages[0];
    const page1 = pages[1];

    await page1.bringToFront();
    await page1.type(dataUiId(IDS.sendboxTextfield), 'I am not superstitious. Just a little stitious.');
    await page0.bringToFront();
    await page0.waitForSelector(dataUiId(IDS.typingIndicator));
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
    const page1 = pages[1];
    await page1.bringToFront();
    // From previous test, input currently says: I am not superstitious. Just a little stitious.
    await page1.keyboard.press('Enter');

    // Read the message to generate stable result
    await pages[0].bringToFront();
    await pages[0].waitForSelector(`[data-ui-status="delivered"]`);

    await page1.bringToFront();
    await page1.waitForSelector(`[data-ui-status="seen"]`);
    page1.reload({ waitUntil: 'networkidle' });
    await waitForChatCompositeToLoad(page1);
    // Fixme: We don't pull readReceipt when initial the chat again, this should be fixed in composite
    await page1.waitForSelector(`[data-ui-status="delivered"]`);
    await stubMessageTimestamps(page1);
    expect(await page1.screenshot()).toMatchSnapshot('rejoin-thread.png');
  });
});

test.describe('Chat Composite custom data model', () => {
  test.beforeEach(async ({ pages }) => {
    for (const page of pages) {
      await updatePageQueryParam(page, { customDataModel: 'true' });
    }
  });

  test('messages, participants and typing indicator reflect custom data modal', async ({ pages }) => {
    await waitForChatCompositeParticipantsToLoad(pages[0], 2);
    await waitForChatCompositeParticipantsToLoad(pages[1], 2);

    // Send typing indicator from page 0
    await pages[0].bringToFront();
    await pages[0].type(dataUiId(IDS.sendboxTextfield), 'Typing to display a typing indicator only');

    // wait for typing indicator
    await pages[1].waitForSelector('#custom-data-model-typing-indicator');
    await pages[1].waitForSelector('#custom-data-model-message');

    // Screenshot should show custom typing indicator and custom rendered message
    await stubMessageTimestamps(pages[1]);
    expect(await pages[1].screenshot()).toMatchSnapshot('custom-data-model.png');
  });
});
