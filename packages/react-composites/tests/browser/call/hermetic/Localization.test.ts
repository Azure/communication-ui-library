// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import {
  waitForCallCompositeToLoad,
  stableScreenshot,
  waitForSelector,
  dataUiId,
  isTestProfileStableFlavor
} from '../../common/utils';
import { expect } from '@playwright/test';
import { IDS } from '../../common/constants';

test.describe('Localization tests', async () => {
  // TODO(prprabhu) Rename this test once metrics show that it has been stabilized.
  test('Configuration page title and participant button in call should be localized', async ({ page, serverUrl }) => {
    test.skip(!isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'configuration';
    initialState.call = undefined;
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { useFrLocale: 'true' }));
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('localized-call-configuration-page.png');
  });

  test('Participant button in call should be localized', async ({ page, serverUrl }) => {
    test.skip(!isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { useFrLocale: 'true' }));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('localized-call-screen.png');
  });
});
