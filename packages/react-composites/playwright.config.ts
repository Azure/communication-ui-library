import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  timeout: 120000,
  use: {
    video: 'retain-on-failure'
  }
};
export default config;
