// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ChatParticipant } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Page } from '@playwright/test';
import { IDS } from './constants';
import { dataUiId, perStepLocalTimeout, screenshotOnFailure, waitForSelector } from './utils';

/**
 * <HiddenChatComposites /> are, well, hidden.
 * This function temporarily brings one to foreground, primarily to send read receipts.
 *
 * @private
 */
export async function temporarilyShowHiddenChatComposite(page: Page, participant: ChatParticipant): Promise<void> {
  await withHiddenChatCompositeInForeground(page, participant, async () => {
    // wait for messages to have loaded
    await waitForSelector(page, dataUiId('chat-composite-message'));
    // sleep for 100ms to give time for the messagethread hook to send the read receipt
    await page.waitForTimeout(100);
  });
}

/**
 * <HiddenChatComposites /> are, well, hidden.
 * This function temporarily brings one to foreground, executes the given function, then hides it again.
 *
 * @private
 */
export async function withHiddenChatCompositeInForeground(
  page: Page,
  participant: ChatParticipant,
  action: () => Promise<void>
): Promise<void> {
  const handle = await page.locator(hiddenCompositeSelector(participant));
  await screenshotOnFailure(page, async () => {
    // Temporarily bring chat composite to foreground.
    await handle.evaluate((node) => (node.style.display = 'block'));
    await handle.waitFor({ state: 'visible', timeout: perStepLocalTimeout() });

    // wait for composite to have loaded
    await waitForSelector(page, dataUiId(IDS.sendboxTextField));
  });
  await action();
  await screenshotOnFailure(page, async () => {
    // Hide it again.
    await handle.evaluate((node) => (node.style.display = 'none'));
    await handle.waitFor({ state: 'hidden', timeout: perStepLocalTimeout() });
  });
}

/**
 * Send a message from one of the hidden chat composites.
 *
 * @private
 */
export async function sendMessageFromHiddenChatComposite(
  page: Page,
  participant: ChatParticipant,
  message: string
): Promise<void> {
  await withHiddenChatCompositeInForeground(page, participant, async () => {
    await page.type(`${hiddenCompositeSelector(participant)} ${dataUiId(IDS.sendboxTextField)}`, message, {
      timeout: perStepLocalTimeout()
    });
    await page.keyboard.press('Enter');
  });
}

/**
 * Type a message from one of the hidden chat composites. This is useful for testing the typing indicator.
 *
 * @remarks
 * Becuase the hidden chat composite is unmounted when hidden, anything typed here is lost when the composite is hidden.
 *
 * @private
 */
export async function typeMessageFromHiddenChatComposite(
  page: Page,
  participant: ChatParticipant,
  message: string
): Promise<void> {
  await withHiddenChatCompositeInForeground(page, participant, async () => {
    await page.type(`${hiddenCompositeSelector(participant)} ${dataUiId(IDS.sendboxTextField)}`, message, {
      timeout: perStepLocalTimeout()
    });
  });
}

/**
 * Type and send the message from one of the hidden chat composites.
 *
 * @private
 */
export async function typeAndSendMessageFromHiddenChatComposite(
  page: Page,
  participant: ChatParticipant,
  message: string
): Promise<void> {
  await withHiddenChatCompositeInForeground(page, participant, async () => {
    await page.type(`${hiddenCompositeSelector(participant)} ${dataUiId(IDS.sendboxTextField)}`, message, {
      timeout: perStepLocalTimeout()
    });
    await page.focus(`${hiddenCompositeSelector(participant)} ${dataUiId(IDS.sendboxTextField)}`);
    await page.keyboard.press('Enter');
  });
}
/**
 * Selects the root node of the hidden chat composite for a participant.
 *
 * @private
 */
export const hiddenCompositeSelector = (participant: ChatParticipant): string =>
  `[id="hidden-composite-${toFlatCommunicationIdentifier(participant.id)}"]`;
