// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { PlaywrightTestConfig } from '@playwright/test';
import common from './playwright.config.common';

const config: PlaywrightTestConfig = {
  ...common,

  // All these tests are hermetic. It is safe to run them in parallel.
  fullyParallel: true
};

export default config;
