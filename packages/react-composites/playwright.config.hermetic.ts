// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { PlaywrightTestConfig } from '@playwright/test';
import common from './playwright.config.common';

const config: PlaywrightTestConfig = {
  ...common,

  // Use a fixed number of workers in CI because some of our CI bots have only one vCPU.
  // Some parallelism still helps in this case.
  workers: process.env.CI ? 2 : undefined,

  // All these tests are hermetic. It is safe to run them in parallel.
  fullyParallel: true
};

export default config;
