// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';

test.describe('Tests related to messaging', async () => {
  test('page[0] can view typing indicator within 10s', async ({ serverUrl, page }) => {
    page.goto(buildUrlForChatAppUsingFakeAdapter(serverUrl, FAKE_CHAT_ADAPTER_ARGS, { enableTypingIndicator: 'true' }));
    await waitForSelector(page, dataUiId(IDS.typingIndicator));
    const indicator = await page.$(dataUiId(IDS.typingIndicator));

    expect(await indicator?.innerHTML()).toContain(FAKE_CHAT_ADAPTER_ARGS.remoteParticipants[0]);
    expect(await stableScreenshot(page, {})).toMatchSnapshot('typing-indicator.png');

    await page.bringToFront();
    // Advance time by 10 seconds to make typingindicator go away
    await page.evaluate(() => {
      const currentDate = new Date();
      currentDate.setSeconds(currentDate.getSeconds() + 10);
      Date.now = () => currentDate.getTime();
    });
    await page.waitForTimeout(1000);
    const indicator1 = await page.$(dataUiId(IDS.typingIndicator));
    expect(await indicator1?.innerHTML()).toBeFalsy();
    expect(await stableScreenshot(page, {})).toMatchSnapshot('typing-indicator-disappears.png');
  });
});
