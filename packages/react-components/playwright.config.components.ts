// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { PlaywrightTestConfig, defineConfig } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';
import { TestOptions } from '../../common/config/playwright/playwrightConfigConstants';
import { config as commonConfig } from '../../common/config/playwright/playwright.config.common';
import { resolve } from 'path';

const isBetaBuild = process.env['COMMUNICATION_REACT_FLAVOR'] === 'beta';

const componentsConfig: PlaywrightTestConfig<TestOptions> = {
  ...commonConfig,
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
  ],
  build: {
    // Fix warning for telemetryVersion and node modules that are not ESM
    commonjsOptions: {
      // Include telemetryVersion.js and node_modules in the commonjs build
      // to avoid warnings about them not being ESM
      // This is a workaround for the fact that Vite does not support ESM in commonjs modules
      // and we need to include telemetryVersion.js in the build
      include: [/telemetryVersion\.js$/, /node_modules/],
      // Controls how CommonJS modules are converted to ES modules when imported with default import
      // Setting to 'true' forces Vite to treat CommonJS module.exports as default exports
      // This helps with files like telemetryVersion.js that use module.exports = value
      // When importing: import telemetryVersion from './telemetryVersion'
      requireReturnsDefault: true,
      // Enables handling of mixed module formats
      // When true, allows ES modules to import CommonJS modules and vice versa
      // Necessary for hybrid codebases transitioning between module systems
      // Helps resolve "default is not exported" errors when importing CommonJS from ESM
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      // resolve internal dependencies for the components tests
      '@internal/acs-ui-common': resolve(__dirname, '../acs-ui-common/src')
    }
  }
};
if (componentsConfig.use) {
  componentsConfig.use.ctViteConfig = ctViteConfig;
} else {
  componentsConfig.use = { ctViteConfig };
}

export default defineConfig<TestOptions>(componentsConfig);
