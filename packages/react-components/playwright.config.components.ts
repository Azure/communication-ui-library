// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';
import { TestOptions } from '../../common/config/playwright/playwrightConfigConstants';
import config from '../../common/config/playwright/playwright.config.common';

const isBetaBuild = process.env['COMMUNICATION_REACT_FLAVOR'] === 'beta';

const componentsConfig: PlaywrightTestConfig<TestOptions> = {
  ...config,
  outputDir: './tests/temp/',
  testDir: './tests/browser/',
  testMatch: '*.spec.tsx',
  snapshotDir: isBetaBuild ? './tests/snapshots/beta' : './tests/snapshots/stable'
};

const ctViteConfig = {
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
};
if (componentsConfig.use) {
  componentsConfig.use.ctViteConfig = ctViteConfig;
} else {
  componentsConfig.use = { ctViteConfig };
}

export default defineConfig<TestOptions>(componentsConfig);
