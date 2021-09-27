// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IDS } from '../common/config';
import { test } from './fixture';
import {
  buildUrl,
  dataUiId,
  stubMessageTimestamps,
  updatePageQueryParam,
  waitForChatCompositeParticipantsToLoad,
  waitForChatCompositeToLoad
} from '../common/utils';
import { Page, expect } from '@playwright/test';
import { PAGE_VIEWPORT } from 'browser/common/defaults';

// All tests in this suite *must be run sequentially*.
// The tests are not isolated, tests may depend on the final-state of the chat thread after previous tests.
//
// We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
// many threads using the same connection string in a short span of time.
test.describe('ErrorBar is shown correctly', async () => {
  test('not shown when nothing is wrong', async ({ serverUrl, page, users }) => {
    const url = buildUrl(serverUrl, users[0]);
    await page.setViewportSize(PAGE_VIEWPORT);
    await page.goto(url, { waitUntil: 'load' });
    await waitForChatCompositeToLoad(page);
    await waitForChatCompositeParticipantsToLoad(page, 2);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-valid-user.png');

    await sendAMessage(page);
    await waitForSendSuccess(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('no-error-bar-for-send-message-with-valid-user.png');
  });

  test('with expired token', async ({ serverUrl, page, users }) => {
    const url = buildUrl(serverUrl, users[0], { token: users[0].token + 'INCORRECT_VALUE' });
    await page.setViewportSize(PAGE_VIEWPORT);
    await page.goto(url, { waitUntil: 'load' });
    await waitForChatCompositeToLoad(page);
    // await page.waitForTimeout(3000);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-expired-token.png');

    await sendAMessage(page);
    await waitForSendFailure(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-expired-token.png');
  });

  test('with wrong thread ID', async ({ serverUrl, page, users }) => {
    const url = buildUrl(serverUrl, users[0], { threadId: 'INCORRECT_VALUE' });
    await page.setViewportSize(PAGE_VIEWPORT);
    await page.goto(url, { waitUntil: 'load' });
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-wrong-thread-id.png');

    await sendAMessage(page);
    await waitForSendFailure(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-wrong-thread-id.png');
  });

  test('with wrong endpoint', async ({ serverUrl, page, users }) => {
    const url = buildUrl(serverUrl, users[0], { endpointUrl: 'https://INCORRECT.VALUE' });
    await page.setViewportSize(PAGE_VIEWPORT);
    await page.goto(url, { waitUntil: 'load' });
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
  await page.type(dataUiId(IDS.sendboxTextfield), 'No, sir, this will not do.');
  await page.keyboard.press('Enter');
};

const waitForSendFailure = async (page: Page): Promise<void> => {
  await page.waitForSelector(`[data-ui-status="failed"]`);
};

const waitForSendSuccess = async (page: Page): Promise<void> => {
  await page.waitForSelector(`[data-ui-status="delivered"]`);
};
