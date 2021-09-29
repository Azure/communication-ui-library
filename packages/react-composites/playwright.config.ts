// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  timeout: 120000, // Allow for more than the standard 30000. This ensures we get debug stack traces when await functions timeout.
  workers: 1, // Ensure tests run sequentially.
  forbidOnly: !!process.env.CI, // Do not allow `.only` to be committed to the codebase. `.only` should only be used for diagnosing issues.
  use: {
    headless: true,
    video: 'retain-on-failure'
  }
};
export default config;
