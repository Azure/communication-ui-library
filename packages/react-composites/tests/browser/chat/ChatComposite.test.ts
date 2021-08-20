// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IDS } from '../config';
import {
  createChatThreadAndUsers,
  dataUiId,
  gotoPage,
  loadPage,
  stubMessageTimestamps,
  waitForCompositeToLoad
} from '../utils';
import { test } from './fixture';
import { expect } from '@playwright/test';

const PARTICIPANTS = ['Dorian Gutmann', 'Kathleen Carroll'];

// All tests in this suite *must be run sequentially*.
// The tests are not isolated, each test depends on the final-state of the chat thread after previous tests.
//
// We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
// many threads using the same connection string in a short span of time.
test.describe('Chat Composite E2E Tests', () => {
  test.beforeEach(async ({ pages, serverUrl }) => {
    const users = await createChatThreadAndUsers(PARTICIPANTS);
    const pageLoadPromises: Promise<unknown>[] = [];
    for (const idx in pages) {
      const page = pages[idx];
      const user = users[idx];
      await gotoPage(page, serverUrl, user);
      pageLoadPromises.push(waitForCompositeToLoad(page));
      stubMessageTimestamps(pages[idx]);
    }
    await Promise.all(pageLoadPromises);
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
    stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('send-message.png');

    const page1 = pages[1];
    await page1.bringToFront();
    await page1.waitForSelector(`[data-ui-status="delivered"]`);
    stubMessageTimestamps(page1);

    // It could be too slow to get typing indicator here, which makes the test flacky
    // so wait for typing indicator disappearing
    const typingIndicator = await page1.$(dataUiId(IDS.typingIndicator));
    typingIndicator && (await typingIndicator.waitForElementState('hidden'));

    expect(await page1.screenshot()).toMatchSnapshot('receive-message.png');

    await page0.bringToFront();
    await page0.waitForSelector(`[data-ui-status="seen"]`);
    stubMessageTimestamps(page0);
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
    const page = pages[1];
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextfield), 'How the turn tables');
    await page.keyboard.press('Enter');
    // Read the message to generate stable result
    await pages[0].bringToFront();
    await pages[0].waitForSelector(`[data-ui-status="delivered"]`);

    await page.bringToFront();
    await page.waitForSelector(`[data-ui-status="seen"]`);
    page.reload({ waitUntil: 'networkidle' });
    await waitForCompositeToLoad(page);
    // Fixme: We don't pull readReceipt when initial the chat again, this should be fixed in composite
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('rejoin-thread.png');
  });

  test.afterAll(async ({ pages }) => {
    for (const page of pages) {
      page.close();
    }
  });
});

test.describe('Chat Composite custom data model', () => {
  test('can be viewed by user[1]', async ({ testBrowser, serverUrl }) => {
    const user = (await createChatThreadAndUsers(PARTICIPANTS))[1];
    const page = await loadPage(testBrowser, serverUrl, user, { customDataModel: 'true' });
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextfield), 'How the turn tables');
    await page.keyboard.press('Enter');
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    // Now that we are using a promise based custom avatar data injection, we
    // need to wait for the avatar to load before we can take a screenshot.
    await page.waitForTimeout(1000);
    await page.waitForSelector('#custom-data-model-typing-indicator');
    await page.waitForSelector('#custom-data-model-message');
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('custom-data-model.png');
    page.close();
  });
});
