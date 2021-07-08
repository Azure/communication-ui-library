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

const stubTimestamps = (page: Page): void => {
  page.evaluate(() => {
    Array.from(document.getElementsByClassName('ui-chat__message__timestamp')).forEach(
      (i) => (i.innerHTML = 'timestamp')
    );
  });
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
      pages.push(page);
    }
  });

  test.afterAll(async () => {
    await stopServer();
    await browser.close();
  });

  test('composite loads correctly with participant list', async () => {
    await pages[0].bringToFront();
    await pages[0].waitForSelector(dataUiId(IDS.sendboxTextfield));
    await pages[0].waitForSelector(dataUiId(IDS.participantList));
    stubTimestamps(pages[0]);
    expect(await pages[0].screenshot()).toMatchSnapshot('1-chat-screen.png', { threshold: 1 });
  });

  test('can send message', async () => {
    await pages[0].bringToFront();
    await pages[0].waitForSelector(dataUiId(IDS.sendboxTextfield));
    await pages[0].type(dataUiId(IDS.sendboxTextfield), 'How the turn tables');
    await pages[0].keyboard.press('Enter');
    await pages[0].waitForSelector(`[data-ui-status="delivered"]`);
    stubTimestamps(pages[0]);
    expect(await pages[0].screenshot()).toMatchSnapshot('2-send-message.png', { threshold: 1 });
  });
});
