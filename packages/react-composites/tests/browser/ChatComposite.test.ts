import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import { startServer, stopServer } from './app/server';

const SERVER_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, './screenshots');
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

  test('composite loads correctly', async () => {
    await page.waitForSelector('#ChatComposite', { visible: true });
    const chatCompositeSelector = await page.$('#ChatComposite');
    expect(chatCompositeSelector).toBeTruthy();
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'Home.png') });
  });
});
