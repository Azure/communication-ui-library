// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import {
  dataUiId,
  pageClick,
  waitForSelector,
  stableScreenshot,
  isTestProfileDesktop,
  isTestProfileStableFlavor
} from '../../common/utils';
import { IDS } from '../../common/constants';

test.describe('Participant pane tests', async () => {
  test('People pane opens and displays correctly', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));

    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot('call-screen-with-people-pane.png');
  });

  test('click on add people button will show no options for ACS group call', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));

    await waitForSelector(page, dataUiId('call-composite-people-pane'));

    await pageClick(page, dataUiId('call-add-people-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`ACS-group-call-screen-with-empty-dropdown.png`);
  });

  test('click on add people button will show dialpad option for PSTN call', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));

    await waitForSelector(page, dataUiId('call-composite-people-pane'));

    await pageClick(page, dataUiId('call-add-people-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`PSTN-call-screen-with-dialpad-dropdown.png`);
  });

  test('click on dial phone number will open dialpad in PTSC call', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileStableFlavor());
    const initialState = defaultMockCallAdapterState();
    //PSTN call has alternate caller id
    initialState.alternateCallerId = '+1676568678999';
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId(IDS.videoGallery));

    await pageClick(page, dataUiId('call-composite-participants-button'));

    await waitForSelector(page, dataUiId('call-composite-people-pane'));

    await pageClick(page, dataUiId('call-add-people-button'));

    if (isTestProfileDesktop(testInfo)) {
      await waitForSelector(page, dataUiId('call-dial-phone-number-button'));
      await pageClick(page, dataUiId('call-dial-phone-number-button'));
    } else {
      await waitForSelector(page, dataUiId('call-add-people-dropdown'));
      const drawerDialPhoneNumberDiv = await page.$('div[role="menu"] >> text=Dial phone number');
      await drawerDialPhoneNumberDiv?.click();
    }

    expect(await stableScreenshot(page)).toMatchSnapshot(`PSTN-call-screen-with-dialpad.png`);
  });
});
