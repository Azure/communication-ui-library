// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Page } from '@playwright/test';
import { perStepLocalTimeout, screenshotOnFailure } from './utils';

/**
 * <HiddenChatComposites /> are, well, hidden.
 * This function temporarily brings one to foreground, primarily to send read receipts.
 *
 * @private
 */
export async function temporarilyShowHiddenChatComposite(page: Page, participant: ChatParticipant): Promise<void> {
  await withHiddenChatCompositeInForeground(page, participant, async () => {
    return;
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
  });
  await action();
  await screenshotOnFailure(page, async () => {
    // Hide it again.
    await handle.evaluate((node) => (node.style.display = 'none'));
    await handle.waitFor({ state: 'hidden', timeout: perStepLocalTimeout() });
  });
}

const hiddenCompositeSelector = (participant: ChatParticipant): string =>
  `[id="hidden-composite-${toFlatCommunicationIdentifier(participant.id)}"]`;
