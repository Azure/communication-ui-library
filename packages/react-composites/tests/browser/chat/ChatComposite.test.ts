// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import puppeteer, { Browser, Page } from 'puppeteer';
import { dataUiId, createUserAndThread, encodeQueryData } from '../utils';
import { startServer, stopServer } from './app/server';
import { CHAT_UI_IDS } from '../../../src';
import { COMPONENT_UI_IDS } from 'react-components';

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
    const users = await createUserAndThread(
      'endpoint=https://acs-ui-dev.communication.azure.com/;accesskey=MQ/Vbm/XR+f16crsRH8coQenIzpjhfdecGV8F5Y+WkfCsX4w9T/F/8CJICMX0MZo46/HDM+CRaw8mNBxz4sOHA==',
      'Cowabunga',
      ['John', 'Jane']
    );

    const qs = encodeQueryData(users[0]);

    await startServer();
    browser = await puppeteer.launch({
      args: ['--start-maximized', '--disable-features=site-per-process'],
      headless: false
    });
    page = await browser.newPage();
    await page.setViewport(PAGE_VIEWPORT);
    await page.goto(`${SERVER_URL}?${qs}`, { waitUntil: 'networkidle2' });
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

  test('can view myself in participant list', async () => {
    await page.waitForSelector(`${dataUiId(COMPONENT_UI_IDS.participantList)} .ms-Persona`, { visible: true });
    const initials = await page.$$eval(
      `${dataUiId(COMPONENT_UI_IDS.participantList)} .ms-Persona .ms-Persona-initials span`,
      (nodes) => nodes[0].innerHTML
    );
    expect(initials).toEqual('JD');

    const name = await page.$$eval(
      `${dataUiId(COMPONENT_UI_IDS.participantList)} .ms-Persona .ms-Persona-primaryText .ms-TooltipHost`,
      (nodes) => nodes[0].innerHTML
    );
    expect(name).toEqual('John Doe');
  });
});
