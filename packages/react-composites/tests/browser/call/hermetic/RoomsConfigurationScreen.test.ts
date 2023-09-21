// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockConfigurationPageState, test } from './fixture';
import { expect } from '@playwright/test';
import { stableScreenshot, waitForCallCompositeToLoad } from '../../common/utils';

test.describe('Rooms Call Configuration Screen Tests for different roles', () => {
  test('All configurations are enabled for Presenter', async ({ page, serverUrl }) => {
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...defaultMockConfigurationPageState('Presenter') }));
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`rooms-configuration-page-presenter.png`);
  });

  test('All configurations are enabled for Attendee', async ({ page, serverUrl }) => {
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...defaultMockConfigurationPageState('Attendee') }));
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`rooms-configuration-page-attendee.png`);
  });

  test('Only configurations for speaker are enabled for Consumer', async ({ page, serverUrl }) => {
    await page.goto(buildUrlWithMockAdapter(serverUrl, { ...defaultMockConfigurationPageState('Consumer') }));
    await waitForCallCompositeToLoad(page);
    expect(await stableScreenshot(page)).toMatchSnapshot(`rooms-configuration-page-consumer.png`);
  });
});
