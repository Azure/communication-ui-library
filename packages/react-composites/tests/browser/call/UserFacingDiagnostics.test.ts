// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { dataUiId, waitForSelector, stableScreenshot } from '../common/utils';
import { test } from './fixture';
import { buildUrlWithMockAdapter } from './utils';
import { DiagnosticQuality } from './TestCallingState';

test.describe('User Facing Diagnostics tests', async () => {
  test('A banner is shown when user is speaking while muted', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        diagnostics: { media: { speakingWhileMicrophoneIsMuted: { value: true, valueType: 'DiagnosticFlag' } } }
      })
    );
    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'banner-when-speaking-while-muted.png'
    );
  });

  test('Tile should be showing when network reconnect is bad ', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        diagnostics: { network: { networkReconnect: { value: DiagnosticQuality.Bad, valueType: 'DiagnosticQuality' } } }
      })
    );
    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'tile-when-ufd-network-reconnect-is-bad.png'
    );
  });

  test('Error bar should be showing when camera freezes ', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        diagnostics: { media: { cameraFreeze: { value: true, valueType: 'DiagnosticFlag' } } }
      })
    );
    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      'error-bar-when-camera-freezes.png'
    );
  });
});
