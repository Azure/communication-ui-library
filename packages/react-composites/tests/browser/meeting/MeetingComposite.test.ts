// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { dataUiId } from '../common/utils';
import { test } from './fixture';
import { expect, Page } from '@playwright/test';

export const waitForMeetingCompositeToLoad = async (page: Page): Promise<void> => {
  await page.waitForLoadState('load');
  await page.waitForSelector(`${dataUiId('call-composite-start-call-button')}[data-is-focusable="true"]`);
  // @TODO Add more checks to make sure the composite is fully loaded.
};

test.describe('Meeting Composite E2E Tests', () => {
  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await waitForMeetingCompositeToLoad(pages[idx]);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-meeting-screen.png`, { threshold: 0.5 });
    }
  });
});
