import { LaunchOptions } from '@playwright/test';
import path from 'path';

export const DESKTOP_4_TO_3_VIEWPORT = {
  width: 1024,
  height: 768
};

export const DESKTOP_16_TO_9_VIEWPORT = {
  width: 1024,
  height: 576
};

export const chromeLaunchOptions: LaunchOptions = {
  channel: 'chrome',
  permissions: ['notifications', 'camera', 'microphone'],
  args: [
    '--font-render-hinting=none', // Ensures that fonts are rendered consistently.
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
  ],
  // Use the CHROME_PATH environment variable if it's set, otherwise use the default installed browser by playwright.
  // We use a pinned version in GitHub actions to ensure newer versions of Chrome don't suddenly impact our tests.
  // For more information see: [Automated Tests - Pinned version of Chrome](../../docs/automated-tests.md#pinned-version-of-chrome)
  executablePath: process.env.CHROME_PATH ? process.env.CHROME_PATH : undefined
};

const SECOND = 1000;
export const MINUTE = 60 * SECOND;

// Using chromium useragent with a very high version to avoid breaking the unsupportedBrowser page
export const DESKTOP_USER_AGENT = 'Windows Chrome/999.0.0.0';
export const ANDROID_USER_AGENT = 'Android 99 Chrome/999.0.0.0 Mobile';

/**
 * Represents the option that should be used to skip tests for stable
 */
export type TestOptions = {
  isBetaBuild: boolean;
};