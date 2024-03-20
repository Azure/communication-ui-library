// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect, Page } from '@playwright/test';
import { sendMessage, waitForMessageDelivered } from '../../common/chatTestHelpers';
import { stableScreenshot, waitForParticipants, waitForSelector } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';

test.describe('Chat Composite with custom data model', () => {
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
