// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import type { MockCallAdapterState } from '../../../common';
import { IDS } from '../../common/constants';
import { dataUiId, isTestProfileStableFlavor, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';

test.describe('unsupportedBrowser page tests', async () => {
  test.only('unsupportedBrwoser displays correctly', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const initialState = defaultMockUnsupportedBrowserPageState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { useTroubleShootingActions: 'true' }));

    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserPage.png`);
  });
});

const defaultMockUnsupportedBrowserPageState = (): MockCallAdapterState => {
  const state = defaultMockCallAdapterState();
  state.page = 'unsupportedBrowser';
  return state;
};
