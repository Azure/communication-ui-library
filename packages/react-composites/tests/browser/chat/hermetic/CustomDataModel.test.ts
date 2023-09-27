// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect, Page } from '@playwright/test';
import { sendMessage, waitForMessageDelivered } from '../../common/chatTestHelpers';
import { stableScreenshot, waitForParticipants, waitForSelector } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';
import { exec } from 'node:child_process';

test.describe('Chat Composite with custom data model', () => {
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

  test('custom onRenderTypingIndicator and custom onRenderMessage', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        customDataModelEnabled: true,
        showParticipantPane: true
      })
    );
    const testMessageText = 'How the turn tables';
    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);

    /* @conditional-compile-remove(chat-composite-participant-pane) */
    await waitForParticipantListToLoad(page);

    await waitForSelector(page, '#custom-data-model-typing-indicator');
    await waitForSelector(page, '#custom-data-model-message');
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot('custom-data-model.png');
  });
});

const waitForParticipantListToLoad = async (page: Page): Promise<void> => {
  // number of remote participants + the local participant
  const numParticipants = DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants.length + 1;
  await waitForParticipants(page, numParticipants);
};
