// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { EnvironmentInfo } from '@azure/communication-calling';
import { expect } from '@playwright/test';
import type { MockCallAdapterState } from '../../../common';
import { IDS } from '../../common/constants';
import { dataUiId, pageClick, stableScreenshot, waitForCallCompositeToLoad, waitForSelector } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, stubLocalCameraName, test } from './fixture';

/* @conditional-compile-remove(unsupported-browser) */
test.describe('unsupportedBrowser page tests', async () => {
  test('unsupportedBrowser displays correctly without a help link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    const envConfig = {
      platform: true,
      browser: false,
      version: false
    };
    state.environmentInfo = setMockEnvironmentInfo(envConfig);

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserPage-no-link.png`);
  });

  test('unsupportedBrowser displays correctly with a help link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    const envConfig = {
      platform: true,
      browser: false,
      version: false
    };
    state.environmentInfo = setMockEnvironmentInfo(envConfig);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, state, {
        useEnvironmentInfoTroubleshootingOptions: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));
    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentLink));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserPage-with-link.png`);
  });

  test('unsupportedBrowserVersion displays correctly with no help link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    const envConfig = {
      platform: true,
      browser: true,
      version: false
    };
    state.environmentInfo = setMockEnvironmentInfo(envConfig);

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserVersion-with-no-link.png`);
  });

  test('unsupportedBrowserVersion displays correctly with help link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    const envConfig = {
      platform: true,
      browser: true,
      version: false
    };
    state.environmentInfo = setMockEnvironmentInfo(envConfig);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, state, {
        useEnvironmentInfoTroubleshootingOptions: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));
    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentLink));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserVersion-with-link.png`);
  });

  test('unsupportedBrowserVersion displays correctly with help link and continue button', async ({
    page,
    serverUrl
  }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    const envConfig = {
      platform: true,
      browser: true,
      version: false
    };
    state.environmentInfo = setMockEnvironmentInfo(envConfig);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, state, {
        useEnvironmentInfoTroubleshootingOptions: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));
    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentLink));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserVersion-with-link-allow-button.png`);
  });

  test('unsupportedBrowserVersion displays correctly with continue button', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    const envConfig = {
      platform: true,
      browser: true,
      version: false
    };
    state.environmentInfo = setMockEnvironmentInfo(envConfig);

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedBrowserVersion-with-allow-button.png`);
  });

  test('unsupportedBrowserVersion with continue button allows user into config screen', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    const envConfig = {
      platform: true,
      browser: true,
      version: false
    };
    state.environmentInfo = setMockEnvironmentInfo(envConfig);

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));
    await waitForSelector(page, dataUiId(IDS.allowUnsupportedBrowserButton));

    await pageClick(page, dataUiId(IDS.allowUnsupportedBrowserButton));

    state.page = 'configuration';
    state.call = undefined;

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForCallCompositeToLoad(page);
    await stubLocalCameraName(page);

    expect(await stableScreenshot(page)).toMatchSnapshot(
      `unsupportedBrowserVersion-with-allow-button-config-screen.png`
    );
  });

  test('unsupportedOperatingSystem displays correctly with no link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    const envConfig = {
      platform: false,
      browser: false,
      version: false
    };
    state.environmentInfo = setMockEnvironmentInfo(envConfig);

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedOperatingSystem-with-no-link.png`);
  });

  test('unsupportedOperatingSystem displays correctly with link', async ({ page, serverUrl }) => {
    const state = defaultMockUnsupportedBrowserPageState();
    const envConfig = {
      platform: false,
      browser: false,
      version: false
    };
    state.environmentInfo = setMockEnvironmentInfo(envConfig);

    await page.goto(
      buildUrlWithMockAdapter(serverUrl, state, {
        useEnvironmentInfoTroubleshootingOptions: 'true'
      })
    );

    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentIcon));
    await waitForSelector(page, dataUiId(IDS.unsupportedEnvironmentLink));

    expect(await stableScreenshot(page)).toMatchSnapshot(`unsupportedOperatingSystem-with-link.png`);
  });
});

const defaultMockUnsupportedBrowserPageState = (): MockCallAdapterState => {
  const state = defaultMockCallAdapterState();
  state.page = 'unsupportedEnvironment';
  return state;
};

const setMockEnvironmentInfo = (envConfig: {
  platform: boolean;
  browser: boolean;
  version: boolean;
}): EnvironmentInfo => {
  return {
    isSupportedBrowser: envConfig.browser,
    isSupportedBrowserVersion: envConfig.version,
    isSupportedPlatform: envConfig.platform,
    isSupportedEnvironment: true,
    environment: {
      platform: 'test',
      browser: 'test',
      browserVersion: 'test'
    }
  };
};
