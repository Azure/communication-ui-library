// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import type { MockCallAdapterState } from '../../../common';
import { IDS } from '../../common/constants';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';

/* @conditional-compile-remove(unsupported-browser) */
test.describe('unsupportedBrowser page tests', async () => {
  test('unsupportedBrowser displays correctly without a help link', async ({ page, serverUrl }) => {
    await page.goto(buildUrlWithMockAdapter(serverUrl, defaultMockUnsupportedBrowserPageState()));

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserPage-no-link.png`);
  });

  test('unsupportedBrowser displays correctly with a help link', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, defaultMockUnsupportedBrowserPageState(), {
        useEnvironmentInfoTroubleshootingOptions: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));
    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentLink));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserPage-with-link.png`);
  });
});

const defaultMockUnsupportedBrowserPageState = (): MockCallAdapterState => {
  const state = defaultMockCallAdapterState();
  state.page = 'unsupportedEnvironment';
  state.features = { unsupportedEnvironment: true };
  return state;
};
