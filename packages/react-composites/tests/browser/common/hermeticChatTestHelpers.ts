// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Page } from '@playwright/test';
import { waitForSelector } from './utils';

/**
 * When using <HiddenChatComposites />, set the visibility of a hidden chat composite.
 *
 * Useful to temporarily make the hidden composite visible.
 *
 * @private
 */
export async function setHiddenChatCompositeVisibility(
  page: Page,
  participant: ChatParticipant,
  visibile: boolean
): Promise<void> {
  const handle = await page.locator(hiddenCompositeSelector(participant));
  if (visibile) {
    // Display the hidden composite so that sent messages will be seen
    await handle.evaluate((node) => (node.style.display = 'block'));
    await waitForSelector(page, hiddenCompositeSelector(participant) + ' >> visible=true');
  } else {
    // Do not display the hidden composite so that messages sent will not be seen
    await handle.evaluate((node) => (node.style.display = 'none'));
    await waitForSelector(page, hiddenCompositeSelector(participant) + ' >> visible=false');
  }
}

const hiddenCompositeSelector = (participant: ChatParticipant): string =>
  `[id="hidden-composite-${toFlatCommunicationIdentifier(participant.id)}"]`;
