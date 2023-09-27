// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  stubMessageTimestamps,
  waitForChatCompositeToLoad,
  dataUiId,
  pageClick,
  stableScreenshot
} from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';
import { expect } from '@playwright/test';
import { sendMessage, waitForSendMessageFailure } from '../../common/chatTestHelpers';
import { exec } from 'node:child_process';

const TEST_MESSAGE = 'No, sir, this will not do.';

test.describe('ErrorBar is shown correctly', async () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    let freeRam = 0;
    while (freeRam < 1000) {
      exec("free -m | awk 'NR==2 {print $4}'", (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
          // log and return if we encounter an error
          console.error('could not execute command: ', err);
          return;
        }
        // log the output received from the command
        console.log(`Free RAM during test ${JSON.stringify(testInfo.title)}: \n`, output);
        freeRam = parseInt(output);
      });
      if (freeRam >= 1000) {
        return;
      }
      console.log(`${freeRam}MB is not enough RAM for test ${JSON.stringify(testInfo.title)}. Waiting 10s...\n`);
      await new Promise((r) => setTimeout(r, 10000));
    }
  });
  test('with wrong thread ID', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        chatThreadClientMethodErrors: {
          getProperties: { message: 'Could not get properties', statusCode: 400 },
          listMessages: { message: 'Could not list messages', statusCode: 400 },
          sendMessage: { message: 'Could not send message', statusCode: 400 }
        }
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-wrong-thread-id.png');

    await sendMessage(page, TEST_MESSAGE);
    await waitForSendMessageFailure(page);
    await stubMessageTimestamps(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-send-message-with-wrong-thread-id.png');
    // test resend button in contextual menu
    await pageClick(page, dataUiId('chat-composite-message'));
    await pageClick(page, dataUiId('chat-composite-message-action-icon'));
    await page.waitForSelector('[id="chat-composite-message-contextual-menu"]');

    expect(await stableScreenshot(page)).toMatchSnapshot(
      'error-bar-send-message-with-wrong-thread-id-show-resend-button.png'
    );
  });

  test('with expired token', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        chatThreadClientMethodErrors: {
          getProperties: { message: 'Could not get properties', statusCode: 401 },
          listMessages: { message: 'Could not list messages', statusCode: 401 },
          sendMessage: { message: 'Could not send message', statusCode: 401 }
        }
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-expired-token.png');

    await sendMessage(page, TEST_MESSAGE);
    await waitForSendMessageFailure(page);
    await stubMessageTimestamps(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-send-message-with-expired-token.png');
  });

  test('with wrong endpoint', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        chatThreadClientMethodErrors: {
          getProperties: { message: 'Could not get properties', code: 'REQUEST_SEND_ERROR' },
          listMessages: { message: 'Could not list messages', code: 'REQUEST_SEND_ERROR' },
          sendMessage: { message: 'Could not send message', code: 'REQUEST_SEND_ERROR' }
        }
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-wrong-endpoint-url.png');

    await sendMessage(page, TEST_MESSAGE);
    await waitForSendMessageFailure(page);
    await stubMessageTimestamps(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-send-message-with-wrong-endpoint-url.png');
  });
});
