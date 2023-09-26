// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { buildUrlWithMockAdapter, defaultMockConfigurationPageState, test } from './fixture';
import { expect } from '@playwright/test';
import { stableScreenshot, waitForCallCompositeToLoad } from '../../common/utils';
import { exec } from 'node:child_process';

test.describe('Rooms Call Configuration Screen Tests for different roles', () => {
  test.beforeEach(async () => {
    await new Promise((r) => setTimeout(r, 2000));
    exec('free -m', (err, output) => {
      // once the command has completed, the callback function is called
      if (err) {
        // log and return if we encounter an error
        console.error('could not execute command: ', err);
        return;
      }
      // log the output received from the command
      console.log('RAM STATUS: \n', output);
    });
  });

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
