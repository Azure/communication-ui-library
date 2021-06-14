// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
const path = require('path');
const puppeteer = require('puppeteer');

const STORYBOOK_URL = 'http://localhost:6006';
const BASIC_EXAMPLE_URL = STORYBOOK_URL + '/?path=/story/composites-chat--basic-example';
const CONNECTION_STRING = '';
const DISPLAY_NAME = 'TestUser';
const SCREENSHOTS_DIR = path.join(__dirname, './screenshots');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--start-maximized', '--disable-features=site-per-process'],
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 768,
    deviceScaleFactor: 1
  });

  await page.goto(BASIC_EXAMPLE_URL, {
    waitUntil: 'networkidle2'
  });

  const elementHandle = await page.$('#storybook-preview-iframe');
  const frame = await elementHandle.contentFrame();

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'Home.png') });

  await page.type('textarea[id="Connection String_Server Simulator"]', CONNECTION_STRING);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'ConnectionString.png') });

  await page.type('textarea[id="Display Name_Server Simulator"]', DISPLAY_NAME);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'DisplayName.png') });

  await frame.waitForSelector('#ChatComposite', { visible: true });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'ChatLoaded.png') });

  await frame.waitForSelector('textarea#sendbox', { visible: true });
  await frame.type('textarea#sendbox', 'HELLO WORLD');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'MessageTyped.png') });

  await page.keyboard.press('Enter');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'MessageSent.png') });

  const inner_html = await frame.$$eval('.ui-chat__message__content', (nodes) => {
    if (nodes.length < 1) throw new Error('Message not posted to the Chat');
    return nodes[nodes.length - 1].innerHTML;
  });

  if (inner_html !== '<div>HELLO WORLD</div>') throw new Error('Sent Message Not Found');

  const localPartcipantName = await frame.$$eval('.ms-Persona .ms-TooltipHost', (nodes) => {
    if (nodes.length < 1) throw new Error('Local Participant Not Visible in Chat');
    return nodes[0].innerHTML;
  });

  if (localPartcipantName !== DISPLAY_NAME) throw new Error('Local Participant Name Incorrect');

  await browser.close();
})();
