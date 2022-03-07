// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';

const DESKTOP_VIEWPORT = {
  width: 1024,
  height: 768
};

const chromeLaunchOptions = {
  channel: 'chrome',
  permissions: ['notifications', 'camera', 'microphone'],
  args: [
    '--font-render-hinting=none', // Ensures that fonts are rendered consistently.
    '--enable-font-antialiasing', // Ensures that fonts are rendered consistently.
    '--disable-gpu', // Ensures that fonts are rendered consistently.
    '--allow-file-access',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    `--use-file-for-fake-video-capture=${path.join(__dirname, 'tests', 'browser', 'common', 'test.y4m')}`,
    '--lang=en-US',
    '--mute-audio'
  ],
  ignoreDefaultArgs: [
    '--hide-scrollbars' // Don't hide scrollbars in headless mode.
  ]
};

const config: PlaywrightTestConfig = {
  timeout: 60000,

  // Ensure tests run sequentially. All tests in this suite *must be run sequentially*.
  // The tests are not isolated, each test depends on the final-state of the chat thread after previous tests.
  //
  // We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
  // many threads using the same connection string in a short span of time.
  workers: 1,

  // Add an extra retry to mitigate flaky issues.
  // This can be removed if we switch to using a mock ACS service.
  retries: 2,

  // Do not allow `.only` to be committed to the codebase. `.only` should only be used for diagnosing issues.
  forbidOnly: !!process.env.CI,

  // Applies to all projects
  use: {
    headless: true,
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        viewport: DESKTOP_VIEWPORT,
        launchOptions: { ...chromeLaunchOptions }
      }
    },
    {
      name: 'Mobile Android Portrait',
      use: {
        /*
          userAgent: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4641.0 Mobile Safari/537.36',
          viewport: { width: 360, height: 640 },
          deviceScaleFactor: 3,
          isMobile: true,
          hasTouch: true,
          defaultBrowserType: 'chromium'
        */
        ...devices['Nexus 5'],
        launchOptions: { ...chromeLaunchOptions }
      }
    },
    {
      name: 'Mobile Android Landscape',
      use: {
        // Nexus 5 user agent string, taken from node_modules/.../playwright-core/.../deviceDescriptorsSource.json
        userAgent:
          'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4641.0 Mobile Safari/537.36',
        // Smallest supported mobile viewport (iPhone 5/SE)
        viewport: { width: 568, height: 320 },
        // Typical small mobile device scale factor (this simply scales up the produced image)
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'chromium',
        launchOptions: { ...chromeLaunchOptions }
      }
    }
  ]
};

if (process.env['COMMUNICATION_REACT_FLAVOR'] === 'stable') {
  config.snapshotDir = './stable-snapshot';
}

export default config;
