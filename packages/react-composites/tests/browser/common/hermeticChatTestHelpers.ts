// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ElementHandle, Page } from '@playwright/test';
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
  const messageReaderCompositeHandle = await getHiddenCompositeHandleOfParticipant(page, participant.id);
  if (visibile) {
    // Display the hidden composite so that sent messages will be seen
    await messageReaderCompositeHandle.evaluate((node) => (node.style.display = 'block'));
  } else {
    // Do not display the hidden composite so that messages sent will not be seen
    await messageReaderCompositeHandle.evaluate((node) => (node.style.display = 'none'));
  }
}

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
