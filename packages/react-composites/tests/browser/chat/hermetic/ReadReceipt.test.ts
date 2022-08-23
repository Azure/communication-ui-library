// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ElementHandle, expect, Page } from '@playwright/test';
import { sendMessage, waitForMessageDelivered, waitForMessageSeen } from '../../common/chatTestHelpers';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
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
    await setParticipantAbleToSeeMessages(page, messageReader, false);

    const testMessageText = 'How the turn tables';
    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot('sent-messages.png');

    await setParticipantAbleToSeeMessages(page, messageReader, true);
    await waitForMessageSeen(page);

    await page.locator(dataUiId('chat-composite-message-status-icon')).click();
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
      await setParticipantAbleToSeeMessages(page, participant, false);
    });

    const testMessageText = 'How the turn tables';
    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    expect(await stableScreenshot(page, { stubMessageTimestamps: true })).toMatchSnapshot('sent-messages.png');

    DEFAULT_FAKE_CHAT_ADAPTER_ARGS.remoteParticipants.forEach(async (participant) => {
      await setParticipantAbleToSeeMessages(page, participant, true);
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

async function getHiddenCompositeHandleOfParticipant(
  page: Page,
  participantIdentifier: CommunicationIdentifier
): Promise<ElementHandle<SVGElement | HTMLElement>> {
  return await waitForSelector(
    page,
    `[id="hidden-composite-${toFlatCommunicationIdentifier(participantIdentifier)}"]`,
    {
      state: 'attached'
    }
  );
}

async function setParticipantAbleToSeeMessages(
  page: Page,
  participant: ChatParticipant,
  isAble: boolean
): Promise<void> {
  const messageReaderCompositeHandle = await getHiddenCompositeHandleOfParticipant(page, participant.id);
  if (isAble) {
    // Display the hidden composite so that sent messages will be seen
    await messageReaderCompositeHandle.evaluate((node) => (node.style.display = 'block'));
  } else {
    // Do not display the hidden composite so that messages sent will not be seen
    await messageReaderCompositeHandle.evaluate((node) => (node.style.display = 'none'));
  }
}
