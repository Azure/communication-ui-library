// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// import { IDS } from '../config';
import { waitForCallCompositeToLoad } from '../utils';
import { test } from './fixture';

test.describe('Call Composite E2E Tests', () => {
  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await waitForCallCompositeToLoad(pages[idx]);
    }
  });
});
