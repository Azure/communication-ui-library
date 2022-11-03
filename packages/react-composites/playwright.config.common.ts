// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PlaywrightTestConfig, devices, ReporterDescription } from '@playwright/test';
import path from 'path';

const DESKTOP_VIEWPORT = {
  width: 1024,
  height: 768
};

const snapshotDir = process.env.SNAPSHOT_DIR;
if (!snapshotDir) {
  throw new Error('Environment variable SNAPSHOT_DIR not set');
}
const outputDir = process.env.PLAYWRIGHT_OUTPUT_DIR;
if (!outputDir) {
  throw new Error('Environment variable PLAYWRIGHT_OUTPUT_DIR not set');
}

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

const CI_REPORTERS: ReporterDescription[] = [['dot'], ['json', { outputFile: `${outputDir}/e2e-results.json` }]];
const LOCAL_REPORTERS: ReporterDescription[] = [['list']];

const SECOND = 1000;
const MINUTE = 60 * SECOND;

const config: PlaywrightTestConfig = {
  outputDir: outputDir,
  // Extend per-test timeout for local debugging so that developers can single-step through
  // the test in playwright inspector.
  timeout: process.env.LOCAL_DEBUG ? 10 * MINUTE : 1 * MINUTE,

  // Do not allow `.only` to be committed to the codebase. `.only` should only be used for diagnosing issues.
  forbidOnly: !!process.env.CI,

  // Applies to all projects
  use: {
    headless: !process.env.LOCAL_DEBUG,
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
        // Support smallest supported mobile viewport (iPhone 5/SE) ({ width: 568, height: 320 })
        viewport: { width: 568, height: 320 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'chromium',
        launchOptions: { ...chromeLaunchOptions }
      }
    }
  ],
  reporter: process.env.CI ? CI_REPORTERS : LOCAL_REPORTERS,
  snapshotDir: snapshotDir
};

export default config;
