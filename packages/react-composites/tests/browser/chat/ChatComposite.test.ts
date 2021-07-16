// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import path from 'path';
import dotenv from 'dotenv';
import { chromium, Browser, Page } from 'playwright';
import { PARTICIPANT_NAMES, IDS } from '../config';
import { dataUiId, createUserAndThread, encodeQueryData } from '../utils';
import { startServer, stopServer } from './app/server';
import { test, expect } from '@playwright/test';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

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

const CONNECTION_STRING = process.env.CONNECTION_STRING ?? '';
const TOPIC_NAME = 'Cowabunga';

const SERVER_URL = 'http://localhost:3000';

const PAGE_VIEWPORT = {
  width: 1200,
  height: 768
};

const MAX_PARTICIPANTS = 2;

let browser: Browser;
const pages: Array<Page> = [];
const urls: Array<string> = [];
let participants: Array<string>;

test.describe('Chat Composite E2E Tests', () => {
  test.beforeAll(async () => {
    await startServer();

    browser = await chromium.launch({
      args: ['--start-maximized', '--disable-features=site-per-process'],
      headless: true
    });

    participants = PARTICIPANT_NAMES.slice(0, MAX_PARTICIPANTS);

    const users = await createUserAndThread(CONNECTION_STRING, TOPIC_NAME, participants);

    for (let index = 0; index < MAX_PARTICIPANTS; index++) {
      const url = `${SERVER_URL}?${encodeQueryData(users[index])}`;
      const page = await browser.newPage();
      await page.setViewportSize(PAGE_VIEWPORT);
      await page.goto(url, { waitUntil: 'networkidle' });
      // Important: For ensuring that blinking cursor doesn't get captured in
      // snapshots and cause a diff in subsequent tests.
      page.addStyleTag({ content: `* { caret-color: transparent !important; }` });
      pages.push(page);
      urls.push(url);
    }
  });

  test.afterAll(async () => {
    await stopServer();
    await browser.close();
  });

  test('composite pages load completely', async () => {
    for (const idx in pages) {
      await compositeLoaded(pages[idx]);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-chat-screen.png`);
    }
  });

  test('page[0] can send message', async () => {
    const page = pages[0];
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextfield), 'How the turn tables');
    await page.keyboard.press('Enter');
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('send-message.png');
  });

  test('page[1] can receive message', async () => {
    const page = pages[1];
    await page.bringToFront();
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('receive-message.png');
  });

  test('page[0] sent message has a viewed status', async () => {
    const page = pages[0];
    await page.bringToFront();
    await page.waitForSelector(`[data-ui-status="seen"]`);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('read-message-status.png');
  });

  test('page[0] can view typing indicator', async () => {
    const page = pages[1];
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextfield), 'I am not superstitious. Just a little stitious.');
    await pages[0].bringToFront();
    await pages[0].waitForSelector(dataUiId(IDS.typingIndicator));
    const el = await pages[0].$(dataUiId(IDS.typingIndicator));
    expect(await el?.innerHTML()).toContain(participants[1]);
    expect(await pages[0].screenshot()).toMatchSnapshot('typing-indicator.png');
  });

  test('typing indicator disappears after 10 seconds on page[0]', async () => {
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

  test('page[1] can rejoin the chat', async () => {
    const page = pages[1];
    await page.bringToFront();
    page.reload({ waitUntil: 'networkidle' });
    await compositeLoaded(page);
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('receive-message.png');
  });

  test('page[1] can view custom data model', async () => {
    const page = pages[1];
    await page.bringToFront();
    page.goto(`${urls[1]}&customDataModel=true`, { waitUntil: 'networkidle' });
    await compositeLoaded(page);
    await page.waitForSelector('#custom-data-model-typing-indicator');
    await page.waitForSelector('#custom-data-model-message');
    await page.waitForSelector('#custom-data-model-avatar');
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('custom-data-model.png');
  });
});
