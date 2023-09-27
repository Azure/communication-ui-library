// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect, Page } from '@playwright/test';
import { stableScreenshot, waitForPageFontsLoaded } from '../../common/utils';
import type { MockCallAdapterState } from '../../../common';
import { exec } from 'node:child_process';

/* @conditional-compile-remove(call-readiness) */
test.describe('Tests for guidance UI on config page to guide users through enabling device permissions', async () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    let freeRam = 0;
    while (freeRam < 1000) {
      exec("free -m | awk 'NR==2 {print $4}'", (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
          // log and return if we encounter an error
          console.error('could not execute command: ', err);
          return;
        }
        // log the output received from the command
        console.log(`Free RAM during test ${JSON.stringify(testInfo.title)}: \n`, output);
        freeRam = parseInt(output);
      });
      if (freeRam >= 1000) {
        return;
      }
      console.log(`${freeRam}MB is not enough RAM for test ${JSON.stringify(testInfo.title)}. Waiting 10s...\n`);
      await new Promise((r) => setTimeout(r, 10000));
    }
  });
  test('Configuration page should show enable camera/mic modal when both camera and mic permissions are not set', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockConfigPageStateDeviceDisabled();
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        usePermissionTroubleshootingActions: 'true'
      })
    );
    const context = await page.context();
    context.clearPermissions();
    await waitForCallCompositeToLoadWithStartCallDisabled(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-enable-both-device-permission.png`);
  });

  test('Configuration page should show mic and camera disabled modal when both permissions are denied', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockConfigPageStateDeviceDisabled();
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        usePermissionTroubleshootingActions: 'true'
      })
    );

    const context = await page.context();

    context.clearPermissions();
    context.grantPermissions([]);

    await waitForCallCompositeToLoadWithStartCallDisabled(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-permission-disabled.png`);
  });

  test('Configuration page should show mic disabled modal when only mic permission is denied', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockConfigPageStateDeviceDisabled();
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        usePermissionTroubleshootingActions: 'true'
      })
    );
    const context = await page.context();

    context.clearPermissions();
    context.grantPermissions(['camera']);
    await waitForCallCompositeToLoadWithStartCallDisabled(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-mic-permission-disabled.png`);
  });

  test('Configuration page should show camera disabled modal when only camera permission is denied', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockConfigPageStateDeviceDisabled();
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        usePermissionTroubleshootingActions: 'true'
      })
    );
    const context = await page.context();

    context.clearPermissions();
    context.grantPermissions(['microphone']);
    await waitForCallCompositeToLoadWithStartCallDisabled(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-camera-permission-disabled.png`);
  });

  test('Configuration page should not show any modal when device permissions are all granted', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.page = 'configuration';
    initialState.call = undefined;
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        usePermissionTroubleshootingActions: 'true'
      })
    );
    const context = await page.context();

    context.clearPermissions();
    context.grantPermissions(['microphone', 'camera']);
    await waitForCallCompositeToLoadWithStartCallDisabled(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`call-readiness-permission-granted.png`);
  });
});

function defaultMockConfigPageStateDeviceDisabled(): MockCallAdapterState {
  const state = defaultMockCallAdapterState();
  state.page = 'configuration';
  state.call = undefined;
  state.devices = {
    isSpeakerSelectionAvailable: true,
    cameras: [],
    microphones: [],
    speakers: [
      {
        name: '',
        id: 'speaker:',
        isSystemDefault: true,
        deviceType: 'Speaker'
      }
    ],
    unparentedViews: [],
    selectedMicrophone: {
      name: '',
      id: 'microphone:',
      isSystemDefault: true,
      deviceType: 'Microphone'
    },
    selectedSpeaker: {
      name: '',
      id: 'speaker:',
      isSystemDefault: true,
      deviceType: 'Speaker'
    }
  };

  return state;
}

const waitForCallCompositeToLoadWithStartCallDisabled = async (page: Page): Promise<void> => {
  await page.bringToFront();
  await page.waitForLoadState('load');
  await waitForPageFontsLoaded(page);
};
