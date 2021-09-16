// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { dataUiId } from '../common/utils';
import { test } from './fixture';
import { expect, Page } from '@playwright/test';

export const waitForMeetingCompositeToLoad = async (page: Page): Promise<void> => {
  await page.waitForLoadState('load');

  // @TODO
  // We wait 3 sec here to work around flakiness due to timing.
  // It sometimes take a while for the local video / audio streams to load in CI environments.
  // We don't have a good way to know when the composite is fully loaded.
  await page.waitForTimeout(3000);

  // @TODO Add more checks to make sure the composite is fully loaded.
  await page.waitForSelector(`${dataUiId('call-composite-start-call-button')}[data-is-focusable="true"]`);
};

test.describe('Meeting Composite E2E Tests', () => {
  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await waitForMeetingCompositeToLoad(pages[idx]);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-meeting-screen.png`, { threshold: 0.5 });
    }
  });
});
