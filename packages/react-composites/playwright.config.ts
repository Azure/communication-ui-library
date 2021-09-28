import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  timeout: 120000, // Allow for more than the standard 30000 to ensure timeouts in waiting functions present debug stack traces.
  workers: 1, // Ensure tests run sequentially.
  use: {
    video: 'retain-on-failure'
  }
};
export default config;
