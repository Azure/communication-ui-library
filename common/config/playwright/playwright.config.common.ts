// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PlaywrightTestConfig, devices } from '@playwright/test';
import {
  ANDROID_USER_AGENT,
  DESKTOP_4_TO_3_VIEWPORT,
  DESKTOP_USER_AGENT,
  MINUTE,
  chromeLaunchOptions,
  TestOptions
} from './playwrightConfigConstants';

const isBetaBuild = process.env['COMMUNICATION_REACT_FLAVOR'] === 'beta';

export const config: PlaywrightTestConfig<TestOptions> = {
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
    video: 'on-first-retry', // No traces on first attempt - this seems to make tests flaky.
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        viewport: DESKTOP_4_TO_3_VIEWPORT,
        launchOptions: { ...chromeLaunchOptions },
        contextOptions: {
          userAgent: DESKTOP_USER_AGENT
        },
        isBetaBuild: isBetaBuild
      }
    },
    {
      name: 'Mobile Android Portrait',
      use: {
        ...devices['Nexus 5'],
        launchOptions: { ...chromeLaunchOptions },
        userAgent: ANDROID_USER_AGENT,
        isBetaBuild: isBetaBuild
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
        launchOptions: { ...chromeLaunchOptions },
        isBetaBuild: isBetaBuild
      }
    }
  ],
  expect: {
    // composites tests use toMatchSnapshot
    toMatchSnapshot: {
      maxDiffPixels: 1
    },
    // components tests use toHaveScreenshot
    toHaveScreenshot: {
      maxDiffPixels: 1,
      // make stricter comparison for colors, default value was 0.2
      // which didn't catch some color differences for gray colors
      threshold: 0
    }
  }
};
