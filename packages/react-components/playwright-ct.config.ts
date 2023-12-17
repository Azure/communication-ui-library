// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { defineConfig, devices } from '@playwright/experimental-ct-react';
import path from 'path';

const DESKTOP_4_TO_3_VIEWPORT = {
  width: 1024,
  height: 768
};

const DESKTOP_16_TO_9_VIEWPORT = {
  width: 1024,
  height: 576
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
const SECOND = 1000;
const MINUTE = 60 * SECOND;

// Using chromium useragent with a very high version to avoid breaking the unsupportedBrowser page
const DESKTOP_USER_AGENT = 'Windows Chrome/999.0.0.0';
const ANDROID_USER_AGENT = 'Android 99 Chrome/999.0.0.0 Mobile';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/components/playwright/',
  /* The base directory, relative to the config file, for snapshot files created with toMatchSnapshot and toHaveScreenshot. */
  snapshotDir: './__snapshots__',
  // One chance to retry a test on failure
  retries: 1,
  /* Maximum time one test can run for. */
  timeout: 10 * 1000,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

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
  ]
});
