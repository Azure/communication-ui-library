// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDS } from './config';
import { Page } from '@playwright/test';

export const dataUiId = (v: string): string => `[${DATA_UI_ID}="${v}"]`;
const DATA_UI_ID = 'data-ui-id';

export const waitForCompositeToLoad = async (page: Page): Promise<void> => {
  await page.waitForLoadState('load');
  await page.waitForSelector(dataUiId(IDS.sendboxTextfield));
  // The participant list can be empty when there are no participants to load.
  // For example, this happens when incorrect credentials are used in the ErroBar tests.
  //
  // Only waiting for the element to be attached to the DOM is enough, especially given
  // that we wait for 1 second after this step. Reconsider this when we remove that 1 second
  // wait.
  await page.waitForSelector(dataUiId(IDS.participantList), { state: 'attached' });
  // @TODO
  // We wait 1 sec here to work around a bug.
  // If page[0] sends a message to page[1] as soon as the composite is loaded
  // in the DOM, page[1] doesn't receive the message.
  // Only when page[1] is refreshed is when it will see the message sent by p[1]
  // By waiting 1 sec before sending a message, page[1] is able to recieve that message.
  await page.waitForTimeout(1000);
};
