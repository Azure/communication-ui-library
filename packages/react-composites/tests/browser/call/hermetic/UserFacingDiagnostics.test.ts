// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { dataUiId, waitForSelector, stableScreenshot } from '../../common/utils';
import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import type { LatestMediaDiagnostics, LatestNetworkDiagnostics } from '@azure/communication-calling';
import type { MockCallAdapterState } from '../MockCallAdapterState';
import { DiagnosticQuality } from './constants';

test.describe('User Facing Diagnostics tests', async () => {
  test('A banner is shown when user is speaking while muted', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    setMediaDiagnostic(initialState, {
      speakingWhileMicrophoneIsMuted: { value: true, valueType: 'DiagnosticFlag' }
    });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('banner-when-speaking-while-muted.png');
  });

  test('Tile should be showing when network reconnect is bad ', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    setNetworkDiagnostic(initialState, {
      networkReconnect: { value: DiagnosticQuality.Bad, valueType: 'DiagnosticQuality' }
    });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('tile-when-ufd-network-reconnect-is-bad.png');
  });

  test('Error bar should be showing when camera freezes ', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    setMediaDiagnostic(initialState, {
      cameraFreeze: { value: true, valueType: 'DiagnosticFlag' }
    });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-when-camera-freezes.png');
  });

  test('Message bar should show when camera stops unexpectedly', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    setMediaDiagnostic(initialState, {
      cameraStoppedUnexpectedly: { value: DiagnosticQuality.Bad, valueType: 'DiagnosticFlag' }
    });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-camera-stops-unexpectedly.png');
  });

  test('Message bar should show when camera recovers', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    setMediaDiagnostic(initialState, {
      cameraStoppedUnexpectedly: { value: DiagnosticQuality.Good, valueType: 'DiagnosticFlag' }
    });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-camera-recovered.png');
  });

  test('Message bar should show when microphone stops unexpectedly', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    setMediaDiagnostic(initialState, {
      microphoneMuteUnexpectedly: { value: DiagnosticQuality.Bad, valueType: 'DiagnosticFlag' }
    });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-microphone-stops-unexpectedly.png');
  });

  test('Message bar should show when microphone recovers', async ({ page, serverUrl }) => {
    const initialState = defaultMockCallAdapterState();
    setMediaDiagnostic(initialState, {
      microphoneMuteUnexpectedly: { value: DiagnosticQuality.Good, valueType: 'DiagnosticFlag' }
    });
    await page.goto(buildUrlWithMockAdapter(serverUrl, initialState));

    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot('error-bar-microphone-recovered.png');
  });
});

function setMediaDiagnostic(state: MockCallAdapterState, value: LatestMediaDiagnostics): void {
  if (!state.call?.diagnostics.media) {
    throw new Error('State must have default values for diagnostic values');
  }
  state.call.diagnostics.media = {
    latest: value
  };
}

function setNetworkDiagnostic(state: MockCallAdapterState, value: LatestNetworkDiagnostics): void {
  if (!state.call?.diagnostics.network) {
    throw new Error('State must have default values for diagnostic values');
  }
  state.call.diagnostics.network = {
    latest: value
  };
}
