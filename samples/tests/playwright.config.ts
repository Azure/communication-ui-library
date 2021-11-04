// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // Put any shared options on the top level.
  use: {
    headless: true
  },
  // Add an extra retry to mitigate network issues.
  // This can be removed if we switch to using a mock ACS service.
  retries: 2,
  workers: 1,
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 }
      }
    }
  ],
  globalSetup: require.resolve('./globalSetup')
};
export default config;
