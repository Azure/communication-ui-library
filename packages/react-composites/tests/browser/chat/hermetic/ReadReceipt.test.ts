// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { setHiddenChatCompositeVisibility } from '../../common/hermeticChatTestHelpers';
import { sendMessage, waitForMessageDelivered, waitForMessageSeen } from '../../common/chatTestHelpers';
import { dataUiId, pageClick, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test } from './fixture';

test.describe('Chat Composite E2E Tests', () => {
  test('participant can receive message and send readReceipt to message sender', async ({ serverUrl, page }) => {
    const messageReader = DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants[0];
    page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        participantsWithHiddenComposites: [messageReader]
      })
    );
    await setHiddenChatCompositeVisibility(page, messageReader, false);

    await sendMessage(page, 'How the turn tables');
    await waitForMessageDelivered(page);
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot('sent-messages.png');

    await setHiddenChatCompositeVisibility(page, messageReader, true);
    await waitForMessageSeen(page);

    await pageClick(page, dataUiId('chat-composite-message-status-icon'));
    await waitForSelector(page, dataUiId('chat-composite-message-tooltip'));
    expect(await stableScreenshot(page, { stubMessageTimestamps: true, dismissTooltips: false })).toMatchSnapshot(
      'read-message-tooltip-text.png'
    );
  });

  test('participant can receive read receipts and readers should show in contextual menu', async ({
    serverUrl,
    page
  }) => {
    page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        participantsWithHiddenComposites: DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants
      })
    );

    DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants.forEach(async (participant) => {
      await setHiddenChatCompositeVisibility(page, participant, false);
    });

    await sendMessage(page, 'How the turn tables');
    await waitForMessageDelivered(page);

    DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants.forEach(async (participant) => {
      await setHiddenChatCompositeVisibility(page, participant, true);
    });
    await waitForMessageSeen(page);

    await page.locator(dataUiId('chat-composite-message')).first().click();
    await page.locator(dataUiId('chat-composite-message-action-icon')).first().click();
    await waitForSelector(page, '[id="chat-composite-message-contextual-menu"]');
    await page.locator(dataUiId('chat-composite-message-contextual-menu-read-info')).click();
    await waitForSelector(page, '[id="chat-composite-message-contextual-menu-read-name-list"]');
    expect(await stableScreenshot(page)).toMatchSnapshot('read-message-contextualMenu.png');
  });
});
