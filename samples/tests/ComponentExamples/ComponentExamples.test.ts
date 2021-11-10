import { test, expect } from '@playwright/test';
import { encodeQueryData, createChatThreadAndUsers } from '../common/utils';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SERVER_URL = 'http://localhost:8080';
const PARTICIPANTS = ['Jack'];

const dataUiId = (id: string): string => `[data-ui-id="${id}"]`;

const dataUiStatus = (status: string): string => `[data-ui-status="${status}"]`;

test.describe('Component Examples Test', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    const user = await createChatThreadAndUsers(PARTICIPANTS);

    const qs = encodeQueryData(user[0]);
    const url = `${SERVER_URL}?${qs}`;
    await page.goto(url);
  });

  // only need to make sure it is loading correctly, the rest will be the responsibility of composite tests
  test('Whether html page is loaded right with 2 composites', async ({ page }) => {
    // Wait for message to finish sending
    await page.waitForSelector(dataUiId('sendbox-textfield'));
    await page.type(dataUiId('sendbox-textfield'), 'Hello!');
    await page.keyboard.press('Enter');

    await page.waitForSelector(dataUiStatus('delivered'));

    await page.addScriptTag({
      content: `document.querySelector('[data-ui-id=message-timestamp]').innerText='timestamp';`
    });

    // Start local video using custom start button

    await page.click(dataUiId('custom-start-button'));
    await page.waitForFunction(() => {
      const videoNode = document.querySelector('video');
      // HTMLMediaElement.HAVE_ENOUGH_DATA means media is ready for play
      return (
        document.querySelectorAll('video').length === 1 && videoNode?.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA
      );
    });

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('componentExamples-localVideoStarted.png');

    // TODO: page.click on cameraButton is causing some flacky test issues(but manual click is fine)
    // Add this timeout will ensure it is always stable - will need to be removed after figuring things out
    await page.waitForTimeout(5000);
    await page.click('[id="camera-button"]');

    await page.waitForFunction(() => {
      return document.querySelectorAll('video').length === 0;
    });

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('componentExamples-localVideoStopped.png');
  });
});
