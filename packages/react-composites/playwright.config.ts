import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  use: {
    // Capture screenshot when tests failed. In CI this is uploaded to the action artifacts.
    screenshot: 'only-on-failure'
  }
};
export default config;
