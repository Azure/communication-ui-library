// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { waitForMeetingCompositeToLoad } from '../common/utils';
import { test } from './fixture';
import { expect } from '@playwright/test';

test.describe('Meeting Composite E2E Tests', () => {
  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await waitForMeetingCompositeToLoad(pages[idx]);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-meeting-screen.png`, { threshold: 0.5 });
    }
  });
});
