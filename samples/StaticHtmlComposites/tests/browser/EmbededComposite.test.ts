import { test, expect } from '@playwright/test';
import { encodeQueryData, createChatThreadAndUsers } from './utils';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SERVER_URL = 'http://localhost:8080';
const PARTICIPANTS = ['Jack'];

test.describe('JS Bundle Test', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    const user = await createChatThreadAndUsers(PARTICIPANTS);

    const qs = encodeQueryData(user[0]);
    const url = `${SERVER_URL}?${qs}`;
    await page.goto(url);
  });

  // only need to make sure it is loading correctly, the rest will be the responsibility of composite tests
  test('Whether html page is loaded right with 2 composites', async ({ page }) => {
    expect(await page.waitForSelector('text=Start call')).toBeTruthy();
    expect(await page.waitForSelector('text=Hello to you')).toBeTruthy();
    // Wait for message to finish sending
    await page.waitForTimeout(1000);

    await page.addScriptTag({
      content: `document.querySelector('[data-ui-id=message-timestamp]').innerText='timestamp';`
    });

    expect(await page.screenshot()).toMatchSnapshot('embeddedJsHtml.png');
  });
});
