// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// import { IDS } from '../config';
import { waitForCallCompositeToLoad, dataUiId } from '../utils';
import { test } from './fixture';
import { expect } from '@playwright/test';

test.describe('Call Composite E2E Tests', () => {
  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await waitForCallCompositeToLoad(pages[idx]);
      await pages[idx].waitForSelector(dataUiId('call-composite-device-settings'));
      await pages[idx].waitForSelector(dataUiId('call-composite-local-preview'));
      await pages[idx].waitForSelector(`${dataUiId('call-composite-start-call-button')}[data-is-focusable="true"]`);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-call-screen.png`);
    }
  });
});
