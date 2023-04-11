// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { IDS } from '../../common/constants';
import type { CallCompositeOptions } from '../../../../src';

test.describe('CallControls tests', async () => {
  test('CallControls when number of mics drops to zero', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.devices.microphones = [];
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('no-mics.png');
  });

  test('CallControls when number of available cameras drops to zero', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    initialState.devices.cameras = [];
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));
    await waitForSelector(page, dataUiId(IDS.videoGallery));
    expect(await stableScreenshot(page)).toMatchSnapshot('no-videos.png');
  });
});

test.describe('Call composite custom button injection tests', () => {
  test('injected buttons appear', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { injectCustomButtons: 'true' }));
    expect(await stableScreenshot(page)).toMatchSnapshot(`custom-buttons.png`);
  });
});

test.describe('Call composite custom call control options tests', () => {
  test('Control bar buttons correctly show as compact with camera disabled and end call button hidden', async ({
    page,
    serverUrl
  }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    const testOptions: CallCompositeOptions = {
      callControls: {
        displayType: 'compact',
        cameraButton: {
          disabled: true
        },
        microphoneButton: true,
        endCallButton: false,
        devicesButton: undefined,
        legacyControlBarExperience: true
      }
    };
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        customCallCompositeOptions: JSON.stringify(testOptions)
      })
    );
    expect(await stableScreenshot(page)).toMatchSnapshot(`user-set-control-bar-button-options.png`);
  });
});
