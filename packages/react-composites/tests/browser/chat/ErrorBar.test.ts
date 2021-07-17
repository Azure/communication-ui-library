// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IDS } from '../config';
import { test } from './fixture';
import { dataUiId, loadPage, stubMessageTimestamps, waitForCompositeToLoad } from '../utils';
import { Page, expect } from '@playwright/test';

// All tests in this suite *must be run sequentially*.
// The tests are not isolated, tests may depend on the final-state of the chat thread after previous tests.
//
// We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
// many threads using the same connection string in a short span of time.
test.describe('ErrorBar is shown correctly', async () => {
  test('with incorrect thread ID', async ({ testBrowser, serverUrl, users }) => {
    const user = users[0];
    user.threadId = 'INCORRECT_VALUE';
    const page = await loadPage(testBrowser, serverUrl, user);
    await waitForCompositeToLoad(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-wrong-thread-id.png');

    await sendAMessage(page);
    await waitForSendFailure(page);
    stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('error-bar-send-message-with-wrong-thread-id.png');
  });
});

const sendAMessage = async (page: Page): Promise<void> => {
  await page.type(dataUiId(IDS.sendboxTextfield), 'No, sir, this will not do.');
  await page.keyboard.press('Enter');
};

const waitForSendFailure = async (page: Page): Promise<void> => {
  await page.waitForSelector(`[data-ui-status="failed"]`);
};
