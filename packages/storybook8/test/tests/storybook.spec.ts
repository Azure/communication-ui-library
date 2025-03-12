// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect, test } from '@playwright/test';
import { loadStory, getStoryIds } from '../utils.js';

test('Check if embedded links inside each story is valid', async ({ page }) => {
  const storyIds = await getStoryIds(page);

  for (const storyId of storyIds) {
    await loadStory(page, `docs/${storyId}`);
    await page.waitForSelector('#root');
    // Wait for the Storybook iframe to load
    const iframe = await page.frameLocator('iframe#storybook-preview-iframe');
    // Extract all links from the iframe
    const links = await iframe
      .locator('.sbdocs-a')
      .evaluateAll((anchors) => anchors.map((a) => (a as HTMLLinkElement).href));
    // check the links if they go through without errors
    for (const link of links) {
      console.log(`Checking link: ${storyId}-${link}`);
      const response = await page.goto(link);
      expect(response?.ok()).toBe(true);
      const iframe = await page.frameLocator('iframe#storybook-preview-iframe');
      // find h1 with id "error-message" and check if it is visible
      const errorMessage = await iframe.locator('#error-message').isVisible();
      expect(errorMessage).toBe(false);
    }
  }
});
