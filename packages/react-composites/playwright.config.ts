// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

const DESKTOP_VIEWPORT = {
  width: 1024,
  height: 768
};

const config: PlaywrightTestConfig = {
  // Allow for more than the standard 30s (currently set to 2minutes). This is to ensure we get debug stack traces
  // when await functions timeout. Without this, if the test itself decides to timeout, playwright gives poor feedback
  // on what was being awaited.
  // Note: the default timeout of 30s still applies to `page.waitForX` functions, this is just the global timeout
  // per test.
  timeout: 120000,

  // Ensure tests run sequentially. All tests in this suite *must be run sequentially*.
  // The tests are not isolated, each test depends on the final-state of the chat thread after previous tests.
  //
  // We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
  // many threads using the same connection string in a short span of time.
  workers: 1,

  // Do not allow `.only` to be committed to the codebase. `.only` should only be used for diagnosing issues.
  forbidOnly: !!process.env.CI,

  use: {
    viewport: DESKTOP_VIEWPORT,
    headless: true,
    video: 'retain-on-failure',

    launchOptions: {
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
    }
  }
};
export default config;
