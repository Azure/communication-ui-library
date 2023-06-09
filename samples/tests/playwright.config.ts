// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

const TEST_ROOT = '.';

const buildFlavor: 'beta' | 'stable' = process.env['COMMUNICATION_REACT_FLAVOR'] === 'stable' ? 'stable' : 'beta';

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
        permissions: ['notifications', 'camera', 'microphone'],
        // Large enough to contain all UI elements from ComponentExamples sample
        viewport: { width: 900, height: 900 },
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
        },
        // Using chromium useragent with a very high version to avoid breaking the unsupportedBrowser page
        contextOptions: {
          userAgent: 'Windows Chrome/999.0.0.0'
        }
      }
    }
  ],
  expect: {
    toMatchSnapshot: {
      threshold: 0.3
    }
  },
  globalSetup: require.resolve('./globalSetup')
};

config.snapshotDir = `${TEST_ROOT}/snapshots/${buildFlavor}`;

export default config;
