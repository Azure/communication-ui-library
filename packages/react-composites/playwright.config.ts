import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  timeout: 120000, // Allow for more than the standard 30000. This ensures we get debug stack traces when await functions timeout.
  workers: 1, // Ensure tests run sequentially.
  use: {
    headless: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  }
};
export default config;
