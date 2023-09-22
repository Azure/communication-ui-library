// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { PlaywrightTestConfig } from '@playwright/test';
import common from './playwright.config.common';

const config: PlaywrightTestConfig = {
  ...common,

  // Ensure tests run sequentially. All tests in this suite *must be run sequentially*.
  // The tests are not isolated, each test depends on the final-state of the chat thread after previous tests.
  //
  // We cannot use isolated tests because these are live tests -- the ACS chat service throttles our attempt to create
  // many threads using the same connection string in a short span of time.
  workers: 1,

  // Add an extra retry to mitigate flaky issues.
  retries: 2
};

export default config;
