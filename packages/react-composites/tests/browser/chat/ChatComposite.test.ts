// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import puppeteer, { Browser, Page } from 'puppeteer';
import { dataUiId } from '../utils';
import { startServer, stopServer } from './app/server';
import { CHAT_UI_IDS } from '../../../src';
import { COMPONENT_UI_IDS } from '../../../../react-components';

const SERVER_URL = 'http://localhost:3000';
const PAGE_VIEWPORT = {
  width: 1200,
  height: 768,
  deviceScaleFactor: 1
};

let browser: Browser;
let page: Page;

describe('Chat Composite Puppeteer Tests', () => {
  beforeAll(async () => {
    await startServer();
    browser = await puppeteer.launch({
      args: ['--start-maximized', '--disable-features=site-per-process'],
      headless: true
    });
    page = await browser.newPage();
    await page.setViewport(PAGE_VIEWPORT);
    await page.goto(SERVER_URL, { waitUntil: 'networkidle2' });
  });

  afterAll(async () => {
    await stopServer();
    await browser.close();
  });

  test('can load correctly', async () => {
    await page.waitForSelector(dataUiId(CHAT_UI_IDS.chatScreen), { visible: true });
    const chatCompositeSelector = await page.$(dataUiId(CHAT_UI_IDS.chatScreen));
    expect(chatCompositeSelector).toBeTruthy();
  });

  test('can send message', async () => {
    await page.waitForSelector(dataUiId(COMPONENT_UI_IDS.sendboxTextfield), { visible: true });
    await page.type(dataUiId(COMPONENT_UI_IDS.sendboxTextfield), 'HELLO WORLD');
    await page.keyboard.press('Enter');
    const inner_html = await page.$$eval('.ui-chat__message__content', (nodes) => {
      return nodes[nodes.length - 1].innerHTML;
    });
    expect(inner_html).toEqual('<div>HELLO WORLD</div>');
  });
});
