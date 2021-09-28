import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  use: {
    video: 'retain-on-failure'
  }
};
export default config;
