// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { buildUrlWithMockAdapter, defaultMockCallAdapterState, test } from './fixture';
import { expect } from '@playwright/test';
import { stableScreenshot, waitForCallCompositeToLoad } from '../../common/utils';
import type { MockCallAdapterState } from '../../../common';

test.describe('Rooms Call Configuration Screen Tests for different roles', () => {
  test('All configurations are enabled for Presenter', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, { ...defaultMockConfigurationPageState(), roleHint: 'Presenter' })
    );
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`rooms-configuration-page-presenter.png`);
  });

  test('All configurations are enabled for Attendee', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, { ...defaultMockConfigurationPageState(), roleHint: 'Attendee' })
    );
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`rooms-configuration-page-attendee.png`);
  });

  test('Only configurations for speaker are enabled for Consumer', async ({ page, serverUrl }) => {
    await page.goto(
      buildUrlWithMockAdapter(serverUrl, { ...defaultMockConfigurationPageState(), roleHint: 'Consumer' })
    );
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`rooms-configuration-page-consumer.png`);
  });
});

function defaultMockConfigurationPageState(): MockCallAdapterState {
  let state = defaultMockCallAdapterState();
  state = { ...state, call: undefined, page: 'configuration' };
  return state;
}
