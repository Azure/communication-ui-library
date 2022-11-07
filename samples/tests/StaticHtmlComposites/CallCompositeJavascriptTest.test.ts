import { test, expect } from '@playwright/test';
import { encodeQueryData, createChatThreadAndUsers } from '../common/utils';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SERVER_URL = 'http://localhost:8080/callComposite.html';
const PARTICIPANTS = ['Jack'];

test.describe('JS Bundle Test', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    const user = await createChatThreadAndUsers(PARTICIPANTS);

    // Add styles to remove the blinking cursor during snapshot tests
    const styleContent = `
    input {
      color: transparent;
      text-shadow: 0 0 0 black;
    } 
    input:focus {
      outline: none;
    }
  `;

    const qs = encodeQueryData(user[0]);
    const url = `${SERVER_URL}?${qs}`;
    await page.addStyleTag({ content: styleContent });
    await page.goto(url);
  });

  // only need to make sure it is loading correctly, the rest will be the responsibility of composite tests
  test('Whether html page is loaded correctly with call composite', async ({ page }) => {
    expect(await page.waitForSelector('text=Start call')).toBeTruthy();
    await page.waitForTimeout(1000);
    expect(await page.screenshot()).toMatchSnapshot('embeddedJsHtml.png');
  });
});
