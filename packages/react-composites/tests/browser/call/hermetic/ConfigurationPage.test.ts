// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect, Page } from '@playwright/test';
import {
  dataUiId,
  isTestProfileDesktop,
  isTestProfileMobile,
  stableScreenshot,
  waitForCallCompositeToLoad,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';
import type { MockCallAdapterState } from '../../../common';
import type { DeviceManagerState } from '@internal/calling-stateful-client';

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

  test('Configuration screen desktop should show no devices available', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const state = defaultMockConfigurationPageState();
    state.devices = deviceManagerWithNoDevicesState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, state));
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-configuration-page-no-devices-desktop.png`);
  });

  test.only('Configuration screen mobile buttons disabled because no devices', async ({
    page,
    serverUrl
  }, testInfo) => {
    test.skip(isTestProfileDesktop(testInfo));
    const state = defaultMockConfigurationPageState();
    state.devices = deviceManagerWithNoDevicesState();

    await page.goto(buildUrlWithMockAdapter(serverUrl, state));

    await waitForSelector(page, dataUiId(IDS.configurationScreenDevicesButton));

    expect(await stableScreenshot(page)).toMatchSnapshot(`call-configuration-page-no-devices-mobile.png`);
  });
});

function defaultMockConfigurationPageState(): MockCallAdapterState {
  const state = defaultMockCallAdapterState();
  state.page = 'configuration';
  state.call = undefined;
  return state;
}

/**
 * Since we are providing a .y4m video to act as a fake video stream, chrome
 * uses it's file path as the camera name. This file location can differ on
 * every device causing a diff error in test screenshot comparisons.
 * To avoid this error, we replace the unique file path with a custom string.
 */
const stubLocalCameraName = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const element = document.querySelector('[data-ui-id="call-composite-local-camera-settings"]');
    if (element) {
      element.innerHTML = element.innerHTML.replace(/C:.*?y4m/g, 'Fake Camera');
    }
  });
};

const deviceManagerWithNoDevicesState = (): DeviceManagerState => {
  return {
    cameras: [],
    microphones: [],
    speakers: [],
    isSpeakerSelectionAvailable: true,
    unparentedViews: [],
    deviceAccess: { audio: true, video: true }
  };
};
