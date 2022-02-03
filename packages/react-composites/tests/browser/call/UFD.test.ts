// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { expect } from '@playwright/test';
import { dataUiId, clickOutsideOfPage, waitForPageFontsLoaded, waitForSelector } from '../common/utils';
import { test } from './fixture';
import { buildUrlWithMockAdapter } from './utils';
import { DiagnosticQuality } from './TestCallingState';

test.describe('UFD tests', async () => {
  test('UFD test when speaking while muted ', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        diagnostics: { media: { speakingWhileMicrophoneIsMuted: { value: true, valueType: 'DiagnosticFlag' } } }
      })
    );
    // Click outside of screen to turn away initial aria label
    await clickOutsideOfPage(page);
    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('ufd-speaking-while-muted.png');
  });

  test('UFD test when network reconnect is bad ', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        diagnostics: { network: { networkReconnect: { value: DiagnosticQuality.Bad, valueType: 'DiagnosticQuality' } } }
      })
    );
    // Click outside of screen to turn away initial aria label
    await clickOutsideOfPage(page);
    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('ufd-network-reconnect-is-bad.png');
  });

  test('UFD test when camera freezes ', async ({ pages, serverUrl }) => {
    const page = pages[0];
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, {
        diagnostics: { media: { cameraFreeze: { value: true, valueType: 'DiagnosticFlag' } } }
      })
    );
    // Click outside of screen to turn away initial aria label
    await clickOutsideOfPage(page);
    await waitForSelector(page, dataUiId('call-composite-hangup-button'));
    await waitForPageFontsLoaded(page);
    expect(await page.screenshot()).toMatchSnapshot('ufd-camera-freezes.png');
  });
});
