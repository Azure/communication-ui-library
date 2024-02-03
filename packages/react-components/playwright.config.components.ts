// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { defineConfig, devices } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';
import type { TestOptions } from './tests/browser/FlavoredBaseTest';
import {
  ANDROID_USER_AGENT,
  DESKTOP_16_TO_9_VIEWPORT,
  DESKTOP_4_TO_3_VIEWPORT,
  DESKTOP_USER_AGENT,
  MINUTE,
  chromeLaunchOptions
} from '../../common/config/playwright/playwrightConfigConstants';

const notBetaBuildVariable = process.env['COMMUNICATION_REACT_FLAVOR'] !== 'beta';

export default defineConfig<TestOptions>({
  outputDir: './tests/temp/playwright',
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
    ctViteConfig: {
      plugins: [
        react({
          include: /\.(js|jsx|ts|tsx)$/,
          babel: {
            // Use .babelrc files
            babelrc: true,
            // Use babel.config.js files
            configFile: true
          }
        })
      ]
    }
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
        isStableBuild: notBetaBuildVariable
      }
    },
    {
      name: 'Desktop Chrome 16:9',
      use: {
        viewport: DESKTOP_16_TO_9_VIEWPORT,
        launchOptions: { ...chromeLaunchOptions },
        contextOptions: {
          userAgent: DESKTOP_USER_AGENT
        },
        isStableBuild: notBetaBuildVariable
      },
      testMatch: ['OverflowGallery.test.ts']
    },
    {
      name: 'Mobile Android Portrait',
      use: {
        ...devices['Nexus 5'],
        launchOptions: { ...chromeLaunchOptions },
        userAgent: ANDROID_USER_AGENT,
        isStableBuild: notBetaBuildVariable
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
        isStableBuild: notBetaBuildVariable
      }
    }
  ],
  expect: {
    toMatchSnapshot: {
      maxDiffPixels: 1
    }
  },
  testDir: './tests/browser/',
  testMatch: '*.spec.tsx',
  snapshotDir: notBetaBuildVariable ? './tests/snapshots/stable' : './tests/snapshots/beta'
});
