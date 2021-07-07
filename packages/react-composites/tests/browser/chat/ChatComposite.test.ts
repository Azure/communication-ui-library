// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import path from 'path';
import dotenv from 'dotenv';
import { chromium, Browser, Page } from 'playwright';
import faker from 'faker';
import { dataUiId, createUserAndThread, encodeQueryData, getNameInitials } from '../utils';
import { startServer, stopServer } from './app/server';
import { CHAT_UI_IDS } from '../../../src';
import { COMPONENT_UI_IDS } from 'react-components';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

jest.setTimeout(30000);

const CONNECTION_STRING = process.env.CONNECTION_STRING ?? '';
const TOPIC_NAME = 'Cowabunga';

const SERVER_URL = 'http://localhost:3000';

const PAGE_VIEWPORT = {
  width: 1200,
  height: 768
};

const MAX_PAGES = 2;

let browser: Browser;
const pages: Array<Page> = [];
const participants: Array<string> = [];

describe('Chat Composite E2E Tests', () => {
  beforeAll(async () => {
    await startServer();

    browser = await chromium.launch({
      args: ['--start-maximized', '--disable-features=site-per-process'],
      headless: true
    });

    for (let index = 0; index < MAX_PAGES; index++) {
      participants.push(`${faker.name.firstName()} ${faker.name.lastName()}`);
    }

    const users = await createUserAndThread(CONNECTION_STRING, TOPIC_NAME, participants);

    for (let index = 0; index < MAX_PAGES; index++) {
      const qs = encodeQueryData(users[index]);
      const page = await browser.newPage();
      await page.setViewportSize(PAGE_VIEWPORT);
      await page.goto(`${SERVER_URL}?${qs}`, { waitUntil: 'networkidle' });
      pages.push(page);
    }
  });

  afterAll(async () => {
    await stopServer();
    await browser.close();
  });

  test('can load correctly', async () => {
    await pages[0].bringToFront();
    await pages[0].waitForSelector(dataUiId(CHAT_UI_IDS.chatScreen));
    const chatCompositeSelector = await pages[0].$(dataUiId(CHAT_UI_IDS.chatScreen));
    expect(chatCompositeSelector).toBeTruthy();
  });

  test('can send message', async () => {
    await pages[0].bringToFront();
    await pages[0].waitForSelector(dataUiId(COMPONENT_UI_IDS.sendboxTextfield));
    await pages[0].type(dataUiId(COMPONENT_UI_IDS.sendboxTextfield), 'How the turn tables');
    await pages[0].keyboard.press('Enter');
    await pages[0].waitForSelector(`[data-ui-status="delivered"]`);
    const inner_html = await pages[0].$$eval(`[data-ui-status="delivered"]`, (nodes) => {
      return nodes[nodes.length - 1].innerHTML;
    });
    expect(inner_html).toEqual('How the turn tables');
  });

  test('can view myself in participant list', async () => {
    await pages[0].bringToFront();
    await pages[0].waitForSelector(`${dataUiId(COMPONENT_UI_IDS.participantList)} .ms-Persona`);
    const initials = await pages[0].$$eval(
      `${dataUiId(COMPONENT_UI_IDS.participantList)} .ms-Persona .ms-Persona-initials span`,
      (nodes) => nodes[0].innerHTML
    );
    expect(initials).toEqual(getNameInitials(participants[0]));

    const name = await pages[0].$$eval(
      `${dataUiId(COMPONENT_UI_IDS.participantList)} .ms-Persona .ms-Persona-primaryText .ms-TooltipHost`,
      (nodes) => nodes[0].innerHTML
    );
    expect(name).toEqual(participants[0]);
  });

  test('can view all participants in list', async () => {
    await pages[0].bringToFront();
    await pages[0].waitForSelector(`${dataUiId(COMPONENT_UI_IDS.participantList)} .ms-Persona`);
    const initials = await pages[0].$$(
      `${dataUiId(COMPONENT_UI_IDS.participantList)} .ms-Persona .ms-Persona-initials span`
    );

    expect(initials.length).toEqual(participants.length);

    for (const i in initials) {
      expect(await initials[i].innerText()).toEqual(getNameInitials(participants[i]));
    }

    const names = await pages[0].$$(
      `${dataUiId(COMPONENT_UI_IDS.participantList)} .ms-Persona .ms-Persona-primaryText .ms-TooltipHost`
    );
    for (const i in names) {
      expect(await names[i].innerText()).toEqual(participants[i]);
    }
  });
});
