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
test.describe('Video background effects tests', async () => {
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
test.describe('Custom video background effects tests in call screen', async () => {
  test('custom video effect is not enabled when camera is off', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));

    const initialState = videoBackgeoundImagesInitialState();
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));

    await waitForSelector(page, '.camera-split-button');
    await pageClick(page, '.camera-split-button');
    await waitForSelector(page, dataUiId('camera-split-button-video-effects'));
    await pageClick(page, dataUiId('camera-split-button-video-effects'));
    expect(await stableScreenshot(page)).toMatchSnapshot('custom-video-effects-side-pane-none-selected.png');
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=3`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=3`);
    expect(await stableScreenshot(page)).toMatchSnapshot('custom-video-effects-side-pane-warning-camera-off.png');
  });

  test('custom video effect is enabled when camera is on', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const initialState = videoBackgeoundImagesInitialState();
    addDefaultMockLocalVideoStreamState(initialState);
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState, { newControlBarExperience: 'true' }));
    await waitForSelector(page, '.camera-split-button');
    await pageClick(page, '.camera-split-button');
    await waitForSelector(page, dataUiId('camera-split-button-video-effects'));
    await pageClick(page, dataUiId('camera-split-button-video-effects'));
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=4`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=4`);
    expect(
      await stableScreenshot(page, {
        maskVideos: false
      })
    ).toMatchSnapshot('video-effects-side-pane-camera-on-custom-background-1.png');
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=7`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=7`);
    expect(
      await stableScreenshot(page, {
        maskVideos: false
      })
    ).toMatchSnapshot('video-effects-side-pane-camera-on-custom-background-2.png');
  });
});

/* @conditional-compile-remove(video-background-effects) */
test.describe('Custom Video background effects tests in config screen', async () => {
  test('custom video effect is not enabled when camera is off', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const state = defaultMockConfigurationPageState();
    state.videoBackgroundImages = videoBackgroundImages;
    await page.goto(buildUrlWithMockAdapter(serverUrl, state));
    await waitForCallCompositeToLoad(page);
    await waitForSelector(page, dataUiId('call-config-video-effects-button'));
    await pageClick(page, dataUiId('call-config-video-effects-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('custom-video-effects-config-screen-pane-none-selected.png');
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=2`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=2`);
    expect(await stableScreenshot(page)).toMatchSnapshot('custom-video-effects-config-screen-warning-camera-off.png');
  });

  test('custom video effect is enabled when camera is on', async ({ page, serverUrl }, testInfo) => {
    test.skip(isTestProfileMobile(testInfo));
    const state = defaultMockConfigurationPageState();
    state.devices.unparentedViews = deviceManagerWithUnparentedView();
    state.videoBackgroundImages = videoBackgroundImages;
    await page.goto(buildUrlWithMockAdapter(serverUrl, state));
    await waitForCallCompositeToLoad(page);
    await waitForSelector(page, dataUiId('call-config-video-effects-button'));
    await pageClick(page, dataUiId('call-config-video-effects-button'));
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=4`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=4`);
    expect(
      await stableScreenshot(page, {
        maskVideos: false
      })
    ).toMatchSnapshot('video-effects-config-screen-camera-on-custom-background-1.png');
    await waitForSelector(page, dataUiId('video-effects-item') + ` >> nth=7`);
    await pageClick(page, dataUiId('video-effects-item') + ` >> nth=7`);
    expect(
      await stableScreenshot(page, {
        maskVideos: false
      })
    ).toMatchSnapshot('video-effects-config-screen-camera-on-custom-background-2.png');
  });
});
const videoBackgroundImages = [
  {
    key: 'ab1',
    url: '/backgrounds/abstract1.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab2',
    url: '/backgrounds/abstract2.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab3',
    url: '/backgrounds/abstract3.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab4',
    url: '/backgrounds/room1.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab5',
    url: '/backgrounds/room2.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab6',
    url: '/backgrounds/room3.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab7',
    url: '/backgrounds/room4.jpg',
    tooltipText: 'Custom Background'
  }
];
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

const videoBackgeoundImagesInitialState = (): MockCallAdapterState => {
  const paul = defaultMockRemoteParticipant('Paul Bridges');
  const initialState = defaultMockCallAdapterState([paul]);
  initialState.videoBackgroundImages = videoBackgroundImages;
  return initialState;
};
