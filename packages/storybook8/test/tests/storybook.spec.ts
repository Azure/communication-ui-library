// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect, test } from '@playwright/test';
import { loadStory, getStoryIds } from '../utils.js';

test('Take screenshots of all stories', async ({ page }) => {
  const storyIds = await getStoryIds(page);

  for (const storyId of storyIds) {
    await loadStory(page, `docs/${storyId}`);
    await page.waitForSelector('#root');
    await expect(page).toHaveScreenshot(`story-${storyId}.png`);
    const elements = await page.locator('p').locator('a');
    const linkCount = await elements.count();
    if (linkCount === 0) {
      console.log('No links found');
    } else {
      for (let i = 0; i < linkCount; i++) {
        await elements
          .nth(i)
          .getAttribute('id')
          .then((result) => {
            console.log(result);
            if (!(result !== null && result in storyIds)) {
              console.log(elements.nth(i).getAttribute('href'));
            }
          });
      }
    }
  }
});
