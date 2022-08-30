// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Page } from '@playwright/test';
import { perStepLocalTimeout, screenshotOnFailure } from './utils';

/**
 * <HiddenChatComposites /> are, well, hidden.
 * This function temporarily brings them to foreground, primarily to send read receipts.
 *
 * @private
 */
export async function temporarilyShowHiddenChatComposite(page: Page, participant: ChatParticipant): Promise<void> {
  await screenshotOnFailure(page, async () => {
    const handle = await page.locator(hiddenCompositeSelector(participant));
    // Temporarily bring chat composite to foreground.
    await handle.evaluate((node) => (node.style.display = 'block'));
    await handle.waitFor({ state: 'visible', timeout: perStepLocalTimeout() });
    // Hide it again.
    await handle.evaluate((node) => (node.style.display = 'none'));
    await handle.waitFor({ state: 'hidden', timeout: perStepLocalTimeout() });
  });
}

const hiddenCompositeSelector = (participant: ChatParticipant): string =>
  `[id="hidden-composite-${toFlatCommunicationIdentifier(participant.id)}"]`;
