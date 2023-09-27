// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, defaultMockRemoteParticipant, test } from './fixture';
import { expect } from '@playwright/test';
import {
  dataUiId,
  existsOnPage,
  isTestProfileDesktop,
  isTestProfileMobile,
  pageClick,
  stableScreenshot,
  waitForSelector
} from '../../common/utils';
import { IDS } from '../../common/constants';
import type { CallCompositeOptions } from '../../../../src';
import { exec } from 'node:child_process';

test.describe('CallControls tests', async () => {
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

/* @conditional-compile-remove(control-bar-button-injection) */
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

test.describe('New call control bar renders correctly', () => {
  // New call experience will be turned off by default from hermetic test app until it is in stable
  // Add callControls: {} as part of option to enable it (even without turn it on)
  test('Control bar buttons correctly renders', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const testOptions: CallCompositeOptions = {
      callControls: {
        endCallButton: true,
        microphoneButton: true,
        moreButton: undefined
      }
    };
    const callState = defaultMockCallAdapterState([paul]);
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, callState, {
        customCallCompositeOptions: JSON.stringify(testOptions)
      })
    );

    expect(await stableScreenshot(page)).toMatchSnapshot(`new-call-control-experience.png`);
  });

  /* @conditional-compile-remove(control-bar-button-injection) */
  test('injected buttons appear', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, initialState, {
        injectCustomButtons: 'true',
        newControlBarExperience: 'true'
      })
    );

    await pageClick(page, dataUiId('common-call-composite-more-button'));

    expect(await stableScreenshot(page)).toMatchSnapshot(`call-control-new-experience-injected-buttons.png`);
  });

  test('Control bar custom buttons render correctly', async ({ page, serverUrl }) => {
    const callState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, callState, {
        customCallCompositeOptions: JSON.stringify({
          callControls: { microphoneButton: false }
        })
      })
    );

    if (await existsOnPage(page, dataUiId('common-call-composite-more-button'))) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
    }

    expect(await stableScreenshot(page)).toMatchSnapshot(`call-control-new-experience-custom-button.png`);
  });

  test('Control bar people buttons behaves correctly', async ({ page, serverUrl }, testInfo) => {
    const callState = defaultMockCallAdapterState([defaultMockRemoteParticipant('Paul Bridges')]);
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, callState, {
        customCallCompositeOptions: JSON.stringify({
          callControls: { microphoneButton: true }
        })
      })
    );

    if (isTestProfileDesktop(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-people-button'));
    } else if (isTestProfileMobile(testInfo)) {
      await pageClick(page, dataUiId('common-call-composite-more-button'));
      await pageClick(page, `[id="call-composite-drawer-people-button"]`);
    }

    expect(await stableScreenshot(page)).toMatchSnapshot(`call-control-new-experience-people-button.png`);
  });
});
