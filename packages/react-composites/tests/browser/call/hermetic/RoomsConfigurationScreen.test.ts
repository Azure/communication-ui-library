// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import { stableScreenshot, waitForCallCompositeToLoad } from '../../lib/utils';
import type { MockCallAdapterState } from '../MockCallAdapterState';

test.describe('Rooms Call Configuration Screen Tests for different roles', () => {
  test('All configurations are enabled for Presenter', async ({ page, serverUrl }) => {
    await page.goto(buildUrlWithMockAdapter(serverUrl, defaultMockConfigurationPageState(), { role: 'Presenter' }));
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      `rooms-configuration-page-presenter.png`
    );
  });

  test('All configurations are enabled for Attendee', async ({ page, serverUrl }) => {
    await page.goto(buildUrlWithMockAdapter(serverUrl, defaultMockConfigurationPageState(), { role: 'Attendee' }));
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      `rooms-configuration-page-attendee.png`
    );
  });

  test('Only configurations for speaker are enabled for Consumer', async ({ page, serverUrl }) => {
    await page.goto(buildUrlWithMockAdapter(serverUrl, defaultMockConfigurationPageState(), { role: 'Consumer' }));
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page, { dismissTooltips: true })).toMatchSnapshot(
      `rooms-configuration-page-consumer.png`
    );
  });
});

function defaultMockConfigurationPageState(): MockCallAdapterState {
  const state = defaultMockCallAdapterState();
  state.page = 'configuration';
  state.call = undefined;
  return state;
}
