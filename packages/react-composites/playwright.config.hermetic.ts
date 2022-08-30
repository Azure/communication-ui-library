// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { PlaywrightTestConfig } from '@playwright/test';
import common from './playwright.config.common';

const config: PlaywrightTestConfig = {
  ...common,

  // Use a fixed number of workers in CI because some of our CI bots have only one vCPU.
  // Some parallelism still helps in this case.
  workers: process.env.CI ? 3 : undefined,

  // All these tests are hermetic. It is safe to run them in parallel.
  fullyParallel: true,

  // TODO(prprabhu): Remove retries once super flakey tests are fixed or removed.
  retries: 0
};

export default config;
