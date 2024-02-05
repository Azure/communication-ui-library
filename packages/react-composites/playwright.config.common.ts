// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ReporterDescription } from '@playwright/test';
import {
  DESKTOP_16_TO_9_VIEWPORT,
  DESKTOP_USER_AGENT,
  chromeLaunchOptions
} from '../../common/config/playwright/playwrightConfigConstants';
import { config as commonConfig } from '../../common/config/playwright/playwright.config.common';

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

const config = {
  ...commonConfig,
  outputDir: outputDir,
  reporter: process.env.CI ? CI_REPORTERS : LOCAL_REPORTERS,
  testDir: testDir,
  snapshotDir: snapshotDir
};

config.projects?.push({
  name: 'Desktop Chrome 16:9',
  use: {
    viewport: DESKTOP_16_TO_9_VIEWPORT,
    launchOptions: { ...chromeLaunchOptions },
    contextOptions: {
      userAgent: DESKTOP_USER_AGENT
    }
  },
  testMatch: ['OverflowGallery.test.ts']
});

export default config;
