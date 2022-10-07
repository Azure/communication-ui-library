// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import type { MockCallAdapterState } from '../../../common';
import { IDS } from '../../common/constants';
import { dataUiId, isTestProfileStableFlavor, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';

test.describe('unsupportedBrowser page tests', async () => {
  test.only('unsupportedBrwoser displays correctly without a help link', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    await page.goto(buildUrlWithMockAdapter(serverUrl, defaultMockUnsupportedBrowserPageState()));

    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserPage-no-link.png`);
  });

  test('unsupportedBrowser displays correctly with a help link', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, defaultMockUnsupportedBrowserPageState(), {
        useTroubleShootingActions: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserIcon));
    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserLink));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserPage-with-link.png`);
  });
});

const defaultMockUnsupportedBrowserPageState = (): MockCallAdapterState => {
  const state = defaultMockCallAdapterState();
  state.page = 'unsupportedEnvironment';
  return state;
};
