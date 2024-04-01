// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { test as base } from '@playwright/experimental-ct-react';
import { TestOptions } from '../../../../common/config/playwright/playwrightConfigConstants';

/**
 * The test function that should be used to skip tests for stable
 */
export const test = base.extend<TestOptions>({
  // Define an option and provide a default value.
  // This will be overridden in the config.
  isBetaBuild: [true, { option: true }]
});

// This is an example of beta only test, to be deleted when we have some beta tests examples
// betaTest.describe('TypingIndicator beta only test', () => {
//   betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');
//
//   betaTest('TypingIndicator should be shown correctly 123', async ({ mount }) => {
//     const component = await mount(<TypingIndicator typingUsers={[{ userId: '1', displayName: 'User 1' }]} />);
//     await component.evaluate(() => document.fonts.ready);
//     await expect(component).toContainText('User 1 is typing ...');
//     await expect(component).toHaveScreenshot('typing-indicator-1-user-123.png');
//   });
// });
