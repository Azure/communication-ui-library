// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect, Page } from '@playwright/test';
import {
  dataUiId,
  isTestProfileMobile,
  isTestProfileStableFlavor,
  pageClick,
  stableScreenshot,
  waitForPageFontsLoaded,
  waitForSelector
} from '../../common/utils';
import type { MockCallAdapterState } from '../../../common';

test.describe('Tests for guidance UI on config page to guide users through enabling device permissions', async () => {
  test('Configuration page should show enable camera/mic button when camera and mic permissions are not set', async ({
    page,
    serverUrl
  }) => {
    test.skip(isTestProfileStableFlavor());

    const initialState = defaultMockConfigPageStateDeviceDisabled();
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        usePermissionTroubleshootingActions: 'true',
        customCallCompositeOptions: JSON.stringify({ callReadinessOptedIn: true })
      })
    );

    await waitForCallCompositeToLoadWithStartCallDisabled(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-enable-device-permission.png`);
  });

  test('Clicking on enable camera/mic button should show modal on Desktop', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileStableFlavor());
    test.skip(isTestProfileMobile(testInfo));
    const initialState = defaultMockConfigPageStateDeviceDisabled();
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        usePermissionTroubleshootingActions: 'true',
        customCallCompositeOptions: JSON.stringify({ callReadinessOptedIn: true })
      })
    );

    await waitForCallCompositeToLoadWithStartCallDisabled(page);
    await waitForSelector(page, dataUiId('permission-dropdown'));
    await pageClick(page, dataUiId('permission-dropdown') + ' >> nth=0');
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-desktop-helper-modal.png`);
  });

  test('Call Readiness error bar should show up when user deny permissions', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const initialState = defaultMockConfigPageStateDeviceDisabled();
    initialState.devices.deviceAccess = { video: false, audio: false };
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        usePermissionTroubleshootingActions: 'true',
        customCallCompositeOptions: JSON.stringify({ callReadinessOptedIn: true })
      })
    );

    await waitForCallCompositeToLoadWithStartCallDisabled(page);

    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-error-bar.png`);
  });

  test('Call Readiness feature should be hidden when not opted in', async ({ page, serverUrl }) => {
    test.skip(isTestProfileStableFlavor());

    const initialState = defaultMockConfigPageStateDeviceDisabled();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForCallCompositeToLoadWithStartCallDisabled(page);

    expect(await stableScreenshot(page)).toMatchSnapshot(
      `call-composite-config-screen-with-call-readiness-opted-out.png`
    );
  });
});

function defaultMockConfigPageStateDeviceDisabled(): MockCallAdapterState {
  const state = defaultMockCallAdapterState();
  state.page = 'configuration';
  state.call = undefined;
  state.devices = {
    isSpeakerSelectionAvailable: true,
    selectedCamera: { id: 'camera1', name: '1st Camera', deviceType: 'UsbCamera' },
    cameras: [{ id: 'camera1', name: '1st Camera', deviceType: 'UsbCamera' }],
    selectedMicrophone: {
      id: 'microphone1',
      name: '1st Microphone',
      deviceType: 'Microphone',
      isSystemDefault: true
    },
    microphones: [{ id: 'microphone1', name: '1st Microphone', deviceType: 'Microphone', isSystemDefault: true }],
    selectedSpeaker: { id: 'speaker1', name: '1st Speaker', deviceType: 'Speaker', isSystemDefault: true },
    speakers: [{ id: 'speaker1', name: '1st Speaker', deviceType: 'Speaker', isSystemDefault: true }],
    unparentedViews: [],
    deviceAccess: { video: true, audio: true }
  };

  return state;
}

const waitForCallCompositeToLoadWithStartCallDisabled = async (page: Page): Promise<void> => {
  await page.bringToFront();
  await page.waitForLoadState('load');
  await waitForPageFontsLoaded(page);
};
