// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PlaywrightTestConfig, devices, ReporterDescription } from '@playwright/test';
import {
  ANDROID_USER_AGENT,
  DESKTOP_16_TO_9_VIEWPORT,
  DESKTOP_4_TO_3_VIEWPORT,
  DESKTOP_USER_AGENT,
  MINUTE,
  chromeLaunchOptions
} from '../../common/config/playwright/playwrightConfigConstants';

const testDir = process.env.TEST_DIR;
if (!testDir) {
  throw new Error('Environment variable TEST_DIR not set');
}
const snapshotDir = process.env.SNAPSHOT_DIR;
if (!snapshotDir) {
  throw new Error('Environment variable SNAPSHOT_DIR not set');
}
const outputDir = process.env.PLAYWRIGHT_OUTPUT_DIR;
if (!outputDir) {
  throw new Error('Environment variable PLAYWRIGHT_OUTPUT_DIR not set');
}

const CI_REPORTERS: ReporterDescription[] = [['dot'], ['json', { outputFile: `${outputDir}/e2e-results.json` }]];
const LOCAL_REPORTERS: ReporterDescription[] = [['list']];

const config: PlaywrightTestConfig = {
  outputDir: outputDir,
  // Extend per-test timeout for local debugging so that developers can single-step through
  // the test in playwright inspector.
  timeout: process.env.LOCAL_DEBUG ? 10 * MINUTE : 2 * MINUTE,

  // Do not allow `.only` to be committed to the codebase. `.only` should only be used for diagnosing issues.
  forbidOnly: !!process.env.CI,

  // One chance to retry a test on failure
  retries: 1,

  // Applies to all projects
  use: {
    headless: !process.env.LOCAL_DEBUG,
    video: 'on-first-retry' // No traces on first attempt - this seems to make tests flaky.
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        viewport: DESKTOP_4_TO_3_VIEWPORT,
        launchOptions: { ...chromeLaunchOptions },
        contextOptions: {
          userAgent: DESKTOP_USER_AGENT
        }
      }
    },
    {
      name: 'Desktop Chrome 16:9',
      use: {
        viewport: DESKTOP_16_TO_9_VIEWPORT,
        launchOptions: { ...chromeLaunchOptions },
        contextOptions: {
          userAgent: DESKTOP_USER_AGENT
        }
      },
      testMatch: ['OverflowGallery.test.ts']
    },
    {
      name: 'Mobile Android Portrait',
      use: {
        ...devices['Nexus 5'],
        launchOptions: { ...chromeLaunchOptions },
        userAgent: ANDROID_USER_AGENT
      }
    },
    {
      name: 'Mobile Android Landscape',
      use: {
        userAgent: ANDROID_USER_AGENT,
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
  expect: {
    toMatchSnapshot: {
      maxDiffPixels: 1
    }
  },
  reporter: process.env.CI ? CI_REPORTERS : LOCAL_REPORTERS,
  testDir: testDir,
  snapshotDir: snapshotDir
};

export default config;
