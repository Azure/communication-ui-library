// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

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
        launchOptions: {
          args: [
            '--font-render-hinting=none', // Ensures that fonts are rendered consistently.
            '--enable-font-antialiasing', // Ensures that fonts are rendered consistently.
            '--disable-gpu', // Ensures that fonts are rendered consistently.
            '--allow-file-access',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            `--use-file-for-fake-video-capture=${path.join(__dirname, 'common', 'test.y4m')}`,
            '--lang=en-US',
            '--mute-audio'
          ]
        }
      }
    }
  ],
  globalSetup: require.resolve('./globalSetup')
};
export default config;
