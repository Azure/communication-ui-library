// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockConfigurationPageState, stubLocalCameraName, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, stableScreenshot, waitForCallCompositeToLoad, waitForSelector } from '../../common/utils';

test.describe('Call Composite E2E Configuration Screen Tests', () => {
  test('composite pages load completely', async ({ page, serverUrl }) => {
    await page.goto(buildUrlWithMockAdapter(serverUrl, defaultMockConfigurationPageState()));
    await waitForCallCompositeToLoad(page);
    await stubLocalCameraName(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-configuration-page.png`);
  });

  test('local device buttons should show tooltips on hover', async ({ page, serverUrl }) => {
    await page.goto(buildUrlWithMockAdapter(serverUrl, defaultMockConfigurationPageState()));
    await waitForCallCompositeToLoad(page);
    await page.hover(dataUiId('call-composite-local-device-settings-microphone-button'));
    await waitForSelector(page, dataUiId('microphoneButtonLabel-tooltip'));
    await stubLocalCameraName(page);
    expect(await stableScreenshot(page, { dismissTooltips: false })).toMatchSnapshot(
      `call-configuration-page-unmute-tooltip.png`
    );
  });

  test('Configuration screen should display call details', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, defaultMockConfigurationPageState(), { showCallDescription: 'true' })
    );
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot('call-configuration-page-with-call-details.png');
  });
});
