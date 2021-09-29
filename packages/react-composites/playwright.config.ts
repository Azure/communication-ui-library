// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  // Allow for more than the standard 30s (currently set to 2minutes). This is to ensure we get debug stack traces
  // when await functions timeout. Without this, if the test itself decides to timeout, playwright gives poor feedback
  // on what was being awaited.
  // Note: the default timeout of 30s still applies to `page.waitForX` functions, this is just the global timeout
  // per test.
  timeout: 120000,

  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  }
};
export default config;
