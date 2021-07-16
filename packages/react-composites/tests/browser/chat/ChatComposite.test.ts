// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Page } from 'playwright';
import { IDS } from '../config';
import { dataUiId } from '../utils';
import { test } from './fixture';
import { expect } from '@playwright/test';

const messageTimestampId: string = dataUiId(IDS.messageTimestamp);
const stubMessageTimestamps = (page: Page): void => {
  page.evaluate((messageTimestampId) => {
    Array.from(document.querySelectorAll(messageTimestampId)).forEach((i) => (i.innerHTML = 'timestamp'));
  }, messageTimestampId);
};

const compositeLoaded = async (page: Page): Promise<void> => {
  await page.waitForLoadState('load');
  await page.waitForSelector(dataUiId(IDS.sendboxTextfield));
  await page.waitForSelector(dataUiId(IDS.participantList));
  // @TODO
  // We wait 1 sec here to work around a bug.
  // If page[0] sends a message to page[1] as soon as the composite is loaded
  // in the DOM, page[1] doesn't receive the message.
  // Only when page[1] is refreshed is when it will see the message sent by p[1]
  // By waiting 1 sec before sending a message, page[1] is able to recieve that message.
  await page.waitForTimeout(1000);
};

// All tests in this suite *must be run sequentially*.
// The tests are not isolated, each test depends on the final-state of the chat thread after previous tests.
//
// We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
// many threads using the same connection string in a short span of time.
test.describe('Chat Composite E2E Tests', () => {
  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await compositeLoaded(pages[idx]);
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

  test('page[0] can view typing indicator', async ({ pages, participants }) => {
    const page = pages[1];
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextfield), 'I am not superstitious. Just a little stitious.');
    await pages[0].bringToFront();
    await pages[0].waitForSelector(dataUiId(IDS.typingIndicator));
    const el = await pages[0].$(dataUiId(IDS.typingIndicator));
    expect(await el?.innerHTML()).toContain(participants[1]);
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
});
