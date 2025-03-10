// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect, Locator, test } from '@playwright/test';
import { loadStory, getStoryIds } from '../utils.js';

test('Take screenshots of all stories', async ({ page }) => {
  const storyIds = await getStoryIds(page);

  for (const storyId of storyIds) {
    await loadStory(page, `docs/${storyId}`);
    await page.waitForSelector('#root');
    await page.getByRole('button', { name: 'Go full screen [⌥ F]' }).click();
    await expect(page).toHaveScreenshot(`${storyId}.png`);
    // const hrefs = await page.locator("//div[contains(@class, 'sbdocs')").getAttribute('href');
    // get all the elements that have a href attribute and id not in storyids
    // const elements = await page.locator("//a[starts-with(@class, 'sbdocs')]");
    const elements = await page.locator('a');
    console.log(elements);
    const linkCount = await elements.count();
    console.log(linkCount);
    if (linkCount === 0) {
      console.log('No links found');
    } else {
      for (let i = 0; i < linkCount; i++) {
        // //get the text of the quote
        // const link = await elements.nth(i).getAttribute('href');
        // //log it to the console
        // console.log(`Quote: ${link}`);
        // await page.goto(link, { waitUntil: 'networkidle' });
        await elements.nth(i).click();
        await page.waitForSelector('#root');
        await expect(page).toHaveScreenshot(`${storyId}-${elements.innerText}.png`);
      }
    }
  }
});
