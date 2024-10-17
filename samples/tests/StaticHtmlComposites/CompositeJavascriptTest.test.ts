import { test, expect } from '@playwright/test';
import { encodeQueryData, createChatThreadAndUsers, getTestCSS } from '../common/utils';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SERVER_BASE_URL = 'http://localhost:8080/';
const PARTICIPANTS = ['Jack'];

const isBetaBuild = process.env['COMMUNICATION_REACT_FLAVOR'] === 'beta';

test.describe('JS Bundle Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({ content: getTestCSS() });
  });

  // only need to make sure it is loading correctly, the rest will be the responsibility of composite tests
  test('Whether html page is loaded correctly with call composite', async ({ page }) => {
    const user = await createChatThreadAndUsers(PARTICIPANTS);
    const qs = encodeQueryData(user[0]);
    const getTestUrl = (subPageHtml) => `${SERVER_BASE_URL}${subPageHtml}?${qs}`;
    await page.goto(getTestUrl('callComposite.html'));

    expect(await page.waitForSelector('text=Start call')).toBeTruthy();
    await page.waitForTimeout(1000);
    expect(await page.screenshot()).toMatchSnapshot('callCompositeHtmlCheck.png');
  });

  test('Whether html page is loaded correctly with chat composite', async ({ page }) => {
    const user = await createChatThreadAndUsers(PARTICIPANTS);
    const qs = encodeQueryData(user[0]);
    const getTestUrl = (subPageHtml) => `${SERVER_BASE_URL}${subPageHtml}?${qs}`;
    await page.goto(getTestUrl('chatComposite.html'));

    expect(await page.waitForSelector('text=Hello to you')).toBeTruthy();

    // Wait for message to finish sending
    await page.waitForSelector('[data-ui-id=chat-composite-message-status-icon][aria-label="Message sent"]');

    // Flakey test fix: wait for participant list to have finished loading
    if (isBetaBuild) {
      await page.waitForSelector('[data-ui-id=participant-item]');
    }

    await page.addScriptTag({
      content: `document.querySelector('[data-ui-id=message-timestamp]').innerText='timestamp';`
    });

    expect(await page.screenshot()).toMatchSnapshot('chatCompositeHtmlCheck.png');
  });

  test('Whether html page is loaded correctly with callWithChat composite', async ({ page }) => {
    const user = await createChatThreadAndUsers(PARTICIPANTS);
    const qs = encodeQueryData(user[0]);
    const getTestUrl = (subPageHtml) => `${SERVER_BASE_URL}${subPageHtml}?${qs}`;
    await page.goto(getTestUrl('callWithChatComposite.html'));

    expect(await page.waitForSelector('text=Start call')).toBeTruthy();
    await page.waitForTimeout(1000);
    expect(await page.screenshot()).toMatchSnapshot('callWithChatCompositeHtmlCheck.png');
  });
});
