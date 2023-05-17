// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import {
  dataUiId,
  isTestProfileMobile,
  pageClick,
  stableScreenshot,
  waitForCallCompositeToLoad,
  waitForSelector
} from '../../common/utils';
import {
  addDefaultMockLocalVideoStreamState,
  buildUrlWithMockAdapter,
  defaultMockCallAdapterState,
  defaultMockConfigurationPageState,
  defaultMockRemoteParticipant,
  test
} from './fixture';
import type { MockCallAdapterState } from '../../../common';
import type { LocalVideoStreamState } from '@internal/calling-stateful-client';

/* @conditional-compile-remove(video-background-effects) */
test.describe('Video background effects tests in call screen', async () => {
  test('blur video effect is not enabled when camera if off', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));

    const paul = defaultMockRemoteParticipant('Paul Bridges');

    const participants = [paul];

    const initialState = defaultMockCallAdapterState(participants);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    await waitForSelector(page, '.camera-split-button');
    await pageClick(page, '.camera-split-button');
    await waitForSelector(page, dataUiId('camera-split-button-video-effects'));
    await pageClick(page, dataUiId('camera-split-button-video-effects'));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-effects-side-pane-none-selected.png');
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=1`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=1`);
    expect(await stableScreenshot(page)).toMatchSnapshot('video-effects-side-pane-warning-camera-off.png');
  });

  test('blur video effect is enabled when camera is on', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, videoEnabledInitialState(), { newControlBarExperience: 'true' })
    );
    await waitForSelector(page, '.camera-split-button');
    await pageClick(page, '.camera-split-button');
    await waitForSelector(page, dataUiId('camera-split-button-video-effects'));
    await pageClick(page, dataUiId('camera-split-button-video-effects'));
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=1`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=1`);
    expect(
      await stableScreenshot(page, {
        maskVideos: false
      })
    ).toMatchSnapshot('video-effects-side-pane-blur-selected-camera-on.png');
  });
});

/* @conditional-compile-remove(video-background-effects) */
test.describe('Video background effects tests in config screen', async () => {
  test('blur video effect is not enabled when camera if off', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    await page.goto(buildUrlWithMockAdapter(serverUrl, defaultMockConfigurationPageState()));
    await waitForCallCompositeToLoad(page);
    await waitForSelector(page, dataUiId('call-config-video-effects-button'));
    await pageClick(page, dataUiId('call-config-video-effects-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-effects-config-screen-pane-none-selected.png');
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=1`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=1`);
    expect(await stableScreenshot(page)).toMatchSnapshot('video-effects-config-screen-warning-camera-off.png');
  });

  test('blur video effect is enabled when camera is on', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const state = defaultMockConfigurationPageState();
    state.devices.unparentedViews = deviceManagerWithUnparentedView();
    await page.goto(buildUrlWithMockAdapter(serverUrl, state));
    await waitForCallCompositeToLoad(page);
    await waitForSelector(page, dataUiId('call-config-video-effects-button'));
    await pageClick(page, dataUiId('call-config-video-effects-button'));
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=1`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=1`);
    expect(
      await stableScreenshot(page, {
        maskVideos: false
      })
    ).toMatchSnapshot('video-effects-config-screen-blur-camera-on.png');
  });
});

/* @conditional-compile-remove(video-background-effects) */
test.describe('Video background effects error tests', async () => {
  test('video effect error when effect fails and side pane is closed', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const initialState = videoEnabledInitialState();
    initialState.latestErrors = {
      'VideoEffectsFeature.startEffects': {
        // Add 24 hours to current time to ensure the error is not dismissed by default
        timestamp: new Date(Date.now() + 3600 * 1000 * 24),
        name: 'Failure to start video effect',
        message: 'Could not start video effect',
        target: 'VideoEffectsFeature.startEffects',
        innerError: new Error('Unable to apply video effect')
      }
    };
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-effects-error-side-pane-closed.png');
  });

  test('video effect error when effect fails and side pane is open', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const initialState = videoEnabledInitialState();
    initialState.latestErrors = {
      'VideoEffectsFeature.startEffects': {
        // Add 24 hours to current time to ensure the error is not dismissed by default
        timestamp: new Date(Date.now() + 3600 * 1000 * 24),
        name: 'Failure to start video effect',
        message: 'Could not start video effect',
        target: 'VideoEffectsFeature.startEffects',
        innerError: new Error('Unable to apply video effect')
      }
    };
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, '.camera-split-button');
    await pageClick(page, '.camera-split-button');
    await waitForSelector(page, dataUiId('camera-split-button-video-effects'));
    await pageClick(page, dataUiId('camera-split-button-video-effects'));
    expect(await stableScreenshot(page)).toMatchSnapshot('video-effects-error-side-pane-open.png');
  });
});
const videoEnabledInitialState = (): MockCallAdapterState => {
  const paul = defaultMockRemoteParticipant('Paul Bridges');
  const initialState = defaultMockCallAdapterState([paul]);
  addDefaultMockLocalVideoStreamState(initialState);
  return initialState;
};

const deviceManagerWithUnparentedView = (): LocalVideoStreamState[] => {
  return [
    {
      source: {
        deviceType: 'UsbCamera',
        id: 'FakeLocalCamera',
        name: 'FakeLocalCamera'
      },
      mediaStreamType: 'Video'
    }
  ];
};
