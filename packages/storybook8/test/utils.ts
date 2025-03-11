// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Page } from '@playwright/test';

/**
 * Load a specific Storybook story for Playwright testing.
 * @param page - The Playwright page object.
 * @param storyId - The ID of the story to load.
 */
export async function loadStory(page: Page, storyId: string) {
  const url = `https://azure.github.io/communication-ui-library/?path=/${storyId}`;
  console.log(url);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('#root');
}

/**
 * Get all Storybook story IDs.
 * @param page - The Playwright page object.
 * @returns An array of story IDs.
 */
export async function getStoryIds(page: Page): Promise<string[]> {
  await page.goto('https://azure.github.io/communication-ui-library/?path=/docs/overview--docs');
  await page.waitForSelector('#root');
  await page.locator('#composites').getByRole('button', { name: 'Collapse' }).click();
  await page.locator('#components').getByRole('button', { name: 'Collapse' }).click();
  await page.locator('#concepts').getByRole('button', { name: 'Collapse' }).click();
  await page.locator('#examples').getByRole('button', { name: 'Collapse' }).click();
  await page.locator('#stateful-client').getByRole('button', { name: 'Collapse' }).click();

  const links = await page.getByRole('link');
  const linkCount = await links.count();
  const storyIds: string[] = [];
  console.log(linkCount);
  if (linkCount === 0) {
    console.log('No links found');
  } else {
    for (let i = 0; i < linkCount; i++) {
      await links
        .nth(i)
        .getAttribute('id')
        .then((result) => {
          if (result !== null) {
            storyIds.push(result ?? '');
          }
        });
    }
  }
  return storyIds;
}
