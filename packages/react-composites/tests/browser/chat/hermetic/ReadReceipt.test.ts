// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { temporarilyShowHiddenChatComposite } from '../../common/hermeticChatTestHelpers';
import { sendMessage, waitForMessageDelivered, waitForMessageSeen } from '../../common/chatTestHelpers';
import {
  dataUiId,
  perStepLocalTimeout,
  screenshotOnFailure,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
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

    await sendMessage(page, 'How the turn tables');
    await waitForMessageDelivered(page);
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot('sent-messages.png');

    await temporarilyShowHiddenChatComposite(page, messageReader);
    await waitForMessageSeen(page);

    // Can't use `pageClick()` here because we want the tooltips to be shown.
    // `pageClick()` moves the mouse away explicitly to dismiss the tooltips.
    await screenshotOnFailure(
      page,
      async () => await page.click(dataUiId('chat-composite-message-status-icon'), { timeout: perStepLocalTimeout() })
    );
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

    await sendMessage(page, 'How the turn tables');
    await waitForMessageDelivered(page);

    for (const participant of DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants) {
      await temporarilyShowHiddenChatComposite(page, participant);
    }
    await waitForMessageSeen(page);

    await screenshotOnFailure(page, async () => {
      await page.locator(dataUiId('chat-composite-message')).first().click();
      await page.locator(dataUiId('chat-composite-message-action-icon')).first().click();
      await waitForSelector(page, '[id="chat-composite-message-contextual-menu"]');
      await page.locator(dataUiId('chat-composite-message-contextual-menu-read-info')).click();
      await waitForSelector(page, '[id="chat-composite-message-contextual-menu-read-name-list"]');
    });

    expect(await stableScreenshot(page)).toMatchSnapshot('read-message-contextualMenu.png');
  });
});
