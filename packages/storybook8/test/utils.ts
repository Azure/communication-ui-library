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
  const storyIds = await page.evaluate(() => {
    const elements = document.querySelectorAll('a');
    const ids: string[] = [];
    for (const element of elements) {
      if (element.getAttribute('id') !== null) {
        ids.push(element.getAttribute('id') ?? '');
      }
    }
    return ids;
  });
  return storyIds;
}
