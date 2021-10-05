// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Browser, LaunchOptions } from '@playwright/test';
import path from 'path';
import { chromium } from '@playwright/test';

const CHROME_BROWSER_CONFIGURATION: LaunchOptions = {
  // Our calling sdk streaming does not work on chromium 93, remove this line when it gets fixed
  channel: 'chrome',
  args: [
    '--font-render-hinting=medium', // Ensures that fonts are rendered consistently.
    '--enable-font-antialiasing', // Ensures that fonts are rendered consistently.
    '--disable-gpu', // Ensures that fonts are rendered consistently.
    '--allow-file-access',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    `--use-file-for-fake-video-capture=${path.join(__dirname, 'test.y4m')}`,
    '--lang=en-US',
    '--mute-audio'
  ],
  ignoreDefaultArgs: [
    '--hide-scrollbars' // Don't hide scrollbars in headless mode.
  ]
};

/**
 * Starts, and handles closing, the chrome test browser.
 * To be used in a playwright fixture's 'testBrowser'.
 */
/* eslint-disable-next-line no-empty-pattern, @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types */
export const useChromeBrowser = async ({}, use: (r: Browser) => Promise<void>) => {
  const browser = await chromium.launch(CHROME_BROWSER_CONFIGURATION);
  try {
    await use(browser);
  } finally {
    await browser.close();
  }
};
