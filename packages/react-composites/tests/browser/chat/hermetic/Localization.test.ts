// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { stableScreenshot, waitForChatCompositeToLoad } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';
import { exec } from 'node:child_process';

test.describe('Localization tests', async () => {
  test.beforeEach(async () => {
    await new Promise((r) => setTimeout(r, 2000));
    exec('free -m', (err, output) => {
      // once the command has completed, the callback function is called
      if (err) {
        // log and return if we encounter an error
        console.error('could not execute command: ', err);
        return;
      }
      // log the output received from the command
      console.log('RAM STATUS: \n', output);
    });
  });
  test('Participants list header should be localized', async ({ serverUrl, page }) => {
    page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, { ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS, frenchLocaleEnabled: true })
    );
    await page.bringToFront();
    await waitForChatCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('localized-chat.png');
  });
});
