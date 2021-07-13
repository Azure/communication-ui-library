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
const stubTimestamps = (page: Page): void => {
  page.evaluate((messageTimestampId) => {
    Array.from(document.querySelectorAll(messageTimestampId)).forEach((i) => (i.innerHTML = 'timestamp'));
  }, messageTimestampId);
};

const compositeLoaded = async (page: Page): Promise<void> => {
  await page.waitForLoadState('load');
  await page.waitForSelector(dataUiId(IDS.sendboxTextfield));
  await page.waitForSelector(dataUiId(IDS.participantList));
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
      const qs = encodeQueryData(users[index]);
      const page = await browser.newPage();
      await page.setViewportSize(PAGE_VIEWPORT);
      await page.goto(`${SERVER_URL}?${qs}`, { waitUntil: 'networkidle' });
      // Important: For ensuring that blinking cursor doesn't get captured in
      // snapshots and cause a diff in subsequent tests.
      page.addStyleTag({ content: `* { caret-color: transparent !important; }` });
      pages.push(page);
    }
  });

  test.afterAll(async () => {
    await stopServer();
    await browser.close();
  });

  test('composite pages load completely', async () => {
    for (const idx in pages) {
      await compositeLoaded(pages[idx]);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`1-page-${idx}-chat-screen.png`);
    }
  });

  test('can send message', async () => {
    const page = pages[0];
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextfield), 'How the turn tables');
    await page.keyboard.press('Enter');
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    stubTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('2-send-message.png');
  });

  test('can receive message', async () => {
    const page = pages[1];
    await page.bringToFront();
    await page.waitForSelector(`[data-ui-status="delivered"]`);
    stubTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('3-receive-message.png');
  });

  test('read message has a viewed status', async () => {
    const page = pages[0];
    await page.bringToFront();
    await page.waitForSelector(`[data-ui-status="seen"]`);
    stubTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('4-read-message-status.png');
  });

  test('can view typing indicator', async () => {
    const page = pages[1];
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextfield), 'I am not superstitious. Just a little stitious.');
    await pages[0].bringToFront();
    await pages[0].waitForSelector(dataUiId(IDS.typingIndicator));
    const el = await pages[0].$(dataUiId(IDS.typingIndicator));
    expect(await el?.innerHTML()).toContain(participants[1]);
    expect(await pages[0].screenshot()).toMatchSnapshot('5-typing-indicator.png');
  });

  test('typing indicator disappears after 12 seconds', async () => {
    const page = pages[0];
    await page.bringToFront();
    await page.waitForTimeout(12000);
    const el = await page.$(dataUiId(IDS.typingIndicator));
    expect(await el?.innerHTML()).toBeFalsy();
    expect(await page.screenshot()).toMatchSnapshot('6-typing-indicator-disappears.png');
  });
});
