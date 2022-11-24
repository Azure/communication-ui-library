// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { EnvironmentInfo } from '@azure/communication-calling';
import { expect } from '@playwright/test';
import type { MockCallAdapterState } from '../../../common';
import { IDS } from '../../common/constants';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';

/* @conditional-compile-remove(unsupported-browser) */
test.describe('unsupportedBrowser page tests', async () => {
  test('unsupportedBrowser displays correctly without a help link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    state.environmentInfo = setMockEnvironmentInfo(true, false, false);

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserPage-no-link.png`);
  });

  test('unsupportedBrowser displays correctly with a help link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    state.environmentInfo = setMockEnvironmentInfo(true, false, false);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, state, {
        useEnvironmentInfoTroubleshootingOptions: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserIcon));
    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserLink));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserPage-with-link.png`);
  });

  test('unsupportedBrowserVersion displays correctly with no help link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    state.environmentInfo = setMockEnvironmentInfo(true, true, false);

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserVersion-with-no-link.png`);
  });

  test('unsupportedBrowserVersion displays correctly with help link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    state.environmentInfo = setMockEnvironmentInfo(true, true, false);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, state, {
        useEnvironmentInfoTroubleshootingOptions: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserVersion-with-link.png`);
  });

  test('unsupportedOperatingSystem displays correctly with no link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    state.environmentInfo = setMockEnvironmentInfo(false, false, false);

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedOperatingSystem-with-no-link.png`);
  });

  test('unsupportedOperatingSystem displays correctly with link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    state.environmentInfo = setMockEnvironmentInfo(false, false, false);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, state, {
        useEnvironmentInfoTroubleshootingOptions: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserIcon));
    await waitForSelector(page, dataUiId(IDS.unsupportedBrowserLink));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedOperatingSystem-with-link.png`);
  });
});

const defaultMockUnsupportedBrowserPageState = (): MockCallAdapterState => {
  const state = defaultMockCallAdapterState();
  state.page = 'unsupportedEnvironment';
  state.features = { unsupportedEnvironment: true };
  return state;
};

const setMockEnvironmentInfo = (platform: boolean, browser: boolean, version: boolean): EnvironmentInfo => {
  return {
    isSupportedBrowser: browser,
    isSupportedBrowserVersion: version,
    isSupportedPlatform: platform,
    isSupportedEnvironment: true,
    environment: {
      platform: 'test',
      browser: 'test',
      browserVersion: 'test'
    }
  };
};
