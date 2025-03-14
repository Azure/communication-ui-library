// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect, test } from '@playwright/test';
import { loadStory, getStoryIds } from '../utils.js';

test('Check if embedded links inside each story is valid', async ({ page, context }) => {
  const storyIds = await getStoryIds(page);
  console.log(storyIds.length);

  for (const storyId of storyIds) {
    await loadStory(page, `docs/${storyId}`);
    await page.waitForSelector('#root');
    // Wait for the Storybook iframe to load
    const iframe = await page.frameLocator('iframe#storybook-preview-iframe');
    // get all links from iframe with classname sbdocs-a
    const links = await iframe.locator('.sbdocs-content a');
    const linkCount = await links.count();
    console.log(`Found ${linkCount} links in story ${storyId}`);

    for (let i = 0; i < linkCount; i++) {
      const href = await links.nth(i).getAttribute('href');
      const linkText = await links.nth(i).textContent();
      console.log(`Checking link: "${linkText?.trim()}" (${href})`);

      try {
        // Create a promise that will resolve on the next page load
        const pagePromise = context.waitForEvent('page');

        // Click the link (handle if it opens in new tab)
        await links.nth(i).click({ modifiers: ['Meta'] }); // Equivalent to Cmd+click to force new tab

        let newPage;
        try {
          // Wait for new page with a timeout
          newPage = await pagePromise.catch(() => null);

          if (newPage) {
            // Wait for the new page to load
            await newPage.waitForLoadState('networkidle');

            const newIframe = await page.frameLocator('iframe#storybook-preview-iframe');
            const hasError = await newIframe
              .locator('#error-message')
              .isVisible()
              .catch(() => false);

            expect(hasError).toBe(false);
            console.log(`✓ Link "${linkText?.trim()}" (${href}) is valid (opened in new tab)`);

            // Close the new page
            await newPage.close();
          } else {
            // Link didn't open a new tab, check current page
            await page.waitForLoadState('networkidle');
            const newIframe = await page.frameLocator('iframe#storybook-preview-iframe');
            const hasError = await newIframe
              .locator('#error-message')
              .isVisible()
              .catch(() => false);

            expect(hasError).toBe(false);
            console.log(`✓ Link "${linkText?.trim()}" (${href}) is valid (same tab)`);
          }
        } catch (innerError) {
          console.error(`Error while checking new page: ${innerError}`);
        }

        // Go back to the original story page for the next link
        await loadStory(page, `docs/${storyId}`);
        await page.waitForSelector('#root');
      } catch (error) {
        console.error(`Failed to validate link "${linkText?.trim()}" (${href}): ${error}`);
        expect(false).toBe(true);
      }
    }
  }
});
