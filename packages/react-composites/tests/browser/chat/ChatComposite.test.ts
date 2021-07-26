// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IDS } from '../config';
import { dataUiId, loadPage, stubMessageTimestamps, waitForCompositeToLoad } from '../utils';
import { test } from './fixture';
import { expect } from '@playwright/test';

// All tests in this suite *must be run sequentially*.
// The tests are not isolated, each test depends on the final-state of the chat thread after previous tests.
//
// We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
// many threads using the same connection string in a short span of time.
test.describe('Chat Composite E2E Tests', () => {
  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await waitForCompositeToLoad(pages[idx]);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-chat-screen.png`);
    }
  });

  test('page[0] can send message', async ({ pages }) => {
    const page = pages[0];
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextfield), 'How the turn tables');
    await page.keyboard.press('Enter');
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('send-message.png');
  });

  test('page[1] can receive message', async ({ pages }) => {
    const page = pages[1];
    await page.bringToFront();
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('receive-message.png');
  });

  test('page[0] sent message has a viewed status', async ({ pages }) => {
    const page = pages[0];
    await page.bringToFront();
    await page.waitForSelector(`[data-ui-status="seen"]`);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('read-message-status.png');
  });

  test('page[0] can view typing indicator', async ({ pages, users }) => {
    const page = pages[1];
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextfield), 'I am not superstitious. Just a little stitious.');
    await pages[0].bringToFront();
    await pages[0].waitForSelector(dataUiId(IDS.typingIndicator));
    const el = await pages[0].$(dataUiId(IDS.typingIndicator));
    expect(await el?.innerHTML()).toContain(users[1].displayName);
    expect(await pages[0].screenshot()).toMatchSnapshot('typing-indicator.png');
  });

  test('typing indicator disappears after 10 seconds on page[0]', async ({ pages }) => {
    const page = pages[0];
    await page.bringToFront();
    // Advance time by 10 seconds to make typingindicator go away
    await page.evaluate(() => {
      const currentDate = new Date();
      currentDate.setSeconds(currentDate.getSeconds() + 10);
      Date.now = () => currentDate.getTime();
    });
    await page.waitForTimeout(1000);
    const el = await page.$(dataUiId(IDS.typingIndicator));
    expect(await el?.innerHTML()).toBeFalsy();
    expect(await page.screenshot()).toMatchSnapshot('typing-indicator-disappears.png');
  });

  test('page[1] can rejoin the chat', async ({ pages }) => {
    const page = pages[1];
    await page.bringToFront();
    page.reload({ waitUntil: 'networkidle' });
    await waitForCompositeToLoad(page);
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('receive-message.png');
  });

  test('user[1] can view custom data model', async ({ testBrowser, serverUrl, users }) => {
    const user = users[1];
    const page = await loadPage(testBrowser, serverUrl, user, { customDataModel: 'true' });
    await page.bringToFront();
    await waitForCompositeToLoad(page);
    await page.waitForSelector('#custom-data-model-typing-indicator');
    await page.waitForSelector('#custom-data-model-message');
    await page.waitForSelector('#custom-data-model-avatar');
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('custom-data-model.png');
  });
});
