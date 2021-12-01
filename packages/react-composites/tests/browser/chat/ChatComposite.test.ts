// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IDS } from '../common/constants';
import {
  dataUiId,
  stubMessageTimestamps,
  waitForChatCompositeToLoad,
  buildUrl,
  waitForSelector,
  waitForFunction
} from '../common/utils';
import { test } from './fixture';
import { createChatThreadAndUsers, loadNewPage } from '../common/fixtureHelpers';
import { expect, Page } from '@playwright/test';

const PARTICIPANTS = ['Dorian Gutmann', 'Poppy Bjørgen'];

// All chat tests *must be run sequentially*.
// As such they must all be located in this file to guarantee they run sequentially.
// The tests are not isolated, each test depends on the final-state of the chat thread after previous tests.
//
// We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
// many threads using the same connection string in a short span of time.
test.describe('Chat Composite E2E Tests', () => {
  test.beforeEach(async ({ pages, serverUrl }) => {
    const users = await createChatThreadAndUsers(PARTICIPANTS);
    const pageLoadPromises: Promise<unknown>[] = [];
    for (const idx in pages) {
      const page = pages[idx];
      const user = users[idx];
      await page.goto(buildUrl(serverUrl, user));
      pageLoadPromises.push(waitForChatCompositeToLoad(page));
      await stubMessageTimestamps(pages[idx]);
    }
    await Promise.all(pageLoadPromises);
  });

  test('composite pages load completely', async ({ pages }) => {
    expect(await pages[0].screenshot()).toMatchSnapshot(`chat-screen.png`);
  });

  test('page[1] can receive message and send readReceipt when page[0] send message', async ({ pages }) => {
    const page0 = pages[0];
    await page0.bringToFront();
    await page0.type(dataUiId(IDS.sendboxTextField), 'How the turn tables');
    await page0.keyboard.press('Enter');
    await waitForSelector(page0, `[data-ui-status="delivered"]`);
    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('sent-messages.png');

    const page1 = pages[1];
    await page1.bringToFront();
    await waitForSelector(page1, `[data-ui-status="delivered"]`);
    await stubMessageTimestamps(page1);

    // It could be too slow to get typing indicator here, which makes the test flakey
    // so wait for typing indicator disappearing, @Todo: stub out typing indicator instead.
    await page1.waitForTimeout(1000); // ensure typing indicator has had time to appear
    const typingIndicator = await page1.$(dataUiId(IDS.typingIndicator));
    typingIndicator && (await typingIndicator.waitForElementState('hidden')); // ensure typing indicator has now disappeared

    expect(await page1.screenshot()).toMatchSnapshot('received-messages.png');

    await page0.bringToFront();
    await waitForSelector(page0, `[data-ui-status="seen"]`);
    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('read-message-status.png');
  });

  test('page[0] can view typing indicator within 10s', async ({ pages, users }) => {
    const page0 = pages[0];
    const page1 = pages[1];

    await page1.bringToFront();
    await page1.type(dataUiId(IDS.sendboxTextField), 'I am not superstitious. Just a little stitious.');
    await page0.bringToFront();
    await waitForSelector(page0, dataUiId(IDS.typingIndicator));
    const indicator0 = await page0.$(dataUiId(IDS.typingIndicator));

    expect(await indicator0?.innerHTML()).toContain(users[1].displayName);
    expect(await pages[0].screenshot()).toMatchSnapshot('typing-indicator.png');

    await page0.bringToFront();
    // Advance time by 10 seconds to make typingindicator go away
    await page0.evaluate(() => {
      const currentDate = new Date();
      currentDate.setSeconds(currentDate.getSeconds() + 10);
      Date.now = () => currentDate.getTime();
    });
    await page0.waitForTimeout(1000);
    const indicator1 = await page0.$(dataUiId(IDS.typingIndicator));
    expect(await indicator1?.innerHTML()).toBeFalsy();
    expect(await page0.screenshot()).toMatchSnapshot('typing-indicator-disappears.png');
  });

  test('page[1] can rejoin the chat', async ({ pages }) => {
    const page1 = pages[1];
    await page1.bringToFront();
    await page1.type(dataUiId(IDS.sendboxTextField), 'How the turn tables');
    await page1.keyboard.press('Enter');
    // Read the message to generate stable result
    await pages[0].bringToFront();
    await waitForSelector(pages[0], `[data-ui-status="delivered"]`);

    await page1.bringToFront();
    await waitForSelector(page1, `[data-ui-status="seen"]`);
    await page1.reload({ waitUntil: 'networkidle' });
    await waitForChatCompositeToLoad(page1);
    // Fixme: We don't pull readReceipt when initial the chat again, this should be fixed in composite
    await waitForSelector(page1, `[data-ui-status="delivered"]`);
    await stubMessageTimestamps(page1);
    expect(await page1.screenshot()).toMatchSnapshot('rejoin-thread.png');
  });
});

test.describe('Chat Composite custom data model', () => {
  test('can be viewed by user[1]', async ({ browser, serverUrl }) => {
    const user = (await createChatThreadAndUsers(PARTICIPANTS))[1];
    const url = buildUrl(serverUrl, user, { customDataModel: 'true' });
    const page = await loadNewPage(browser, url);
    await page.bringToFront();
    await page.type(dataUiId(IDS.sendboxTextField), 'How the turn tables');
    await page.keyboard.press('Enter');
    await waitForSelector(page, `[data-ui-status="delivered"]`);
    await waitForFunction(page, () => {
      return document.querySelectorAll('[data-ui-id="chat-composite-participant-custom-avatar"]').length === 2;
    });
    await waitForSelector(page, '#custom-data-model-typing-indicator');
    await waitForSelector(page, '#custom-data-model-message');
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('custom-data-model.png');
  });
});

test.describe('Localization tests', async () => {
  test('Participants list header should be localized', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrl(serverUrl, users[0], { useFrLocale: 'true' }));
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('localized-chat.png');
  });
});

test.describe('ErrorBar is shown correctly', async () => {
  test('not shown when nothing is wrong', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrl(serverUrl, users[0]));
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-valid-user.png');

    await sendAMessage(page);
    await waitForSendSuccess(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-send-message-with-valid-user.png');
  });

  test('with wrong thread ID', async ({ page, serverUrl, users }) => {
    const user = users[0];
    user.threadId = 'INCORRECT_VALUE';
    await page.goto(buildUrl(serverUrl, users[0]));
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-wrong-thread-id.png');

    await sendAMessage(page);
    await waitForSendFailure(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-wrong-thread-id.png');
  });

  test('with expired token', async ({ page, serverUrl, users }) => {
    const user = users[0];
    user.token = 'INCORRECT_VALUE' + user.token;
    await page.goto(buildUrl(serverUrl, users[0]));
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-expired-token.png');

    await sendAMessage(page);
    await waitForSendFailure(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-expired-token.png');
  });

  test('with wrong endpoint', async ({ page, serverUrl, users }) => {
    const user = users[0];
    user.endpointUrl = 'https://INCORRECT.VALUE';
    await page.goto(buildUrl(serverUrl, users[0]));
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-wrong-endpoint-url.png');

    await sendAMessage(page);
    await waitForSendFailure(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-wrong-endpoint-url.png');
  });
});

const sendAMessage = async (page: Page): Promise<void> => {
  await page.type(dataUiId(IDS.sendboxTextField), 'No, sir, this will not do.');
  await page.keyboard.press('Enter');
};

const waitForSendFailure = async (page: Page): Promise<void> => {
  await waitForSelector(page, `[data-ui-status="failed"]`);
};

const waitForSendSuccess = async (page: Page): Promise<void> => {
  await waitForSelector(page, `[data-ui-status="delivered"]`);
};
