// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // Put any shared options on the top level.
  use: {
    headless: true
  },
  retries: 1,
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 }
      }
    }
  ],
  globalSetup: require.resolve('./tests/browser/globalSetup')
};
export default config;
