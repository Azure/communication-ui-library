// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';

test.describe('Tests related to typing indicator', async () => {
  test('page can view typing indicator within 10s', async ({ serverUrl, page }) => {
    page.goto(buildUrlForChatAppUsingFakeAdapter(serverUrl, DEFAULT_FAKE_CHAT_ADAPTER_ARGS));
    await page.bringToFront();
    await page.type('[data-ui-id="remote-sendbox-textfield"]', 'test');

    await waitForSelector(page, dataUiId(IDS.typingIndicator));
    const indicator = await page.$(dataUiId(IDS.typingIndicator));

    expect(await indicator?.innerHTML()).toContain(DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants[0].displayName);
    expect(await stableScreenshot(page, {})).toMatchSnapshot('typing-indicator.png');

    await page.bringToFront();
    // Advance time by 10 seconds to make typingindicator go away
    await page.evaluate(() => {
      const currentDate = new Date();
      currentDate.setSeconds(currentDate.getSeconds() + 10);
      Date.now = () => currentDate.getTime();
    });
    await page.waitForTimeout(1000);
    const indicatorAfter10Seconds = await page.$(dataUiId(IDS.typingIndicator));
    expect(await indicatorAfter10Seconds?.innerHTML()).toBeFalsy();
    expect(await stableScreenshot(page, {})).toMatchSnapshot('typing-indicator-disappears.png');
  });
});
