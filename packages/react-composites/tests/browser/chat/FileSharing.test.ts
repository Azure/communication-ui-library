// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { waitForChatCompositeToLoad, buildUrl } from '../common/utils';
import { chatTestSetup } from '../common/chatTestHelpers';
import { test } from './fixture';
import { expect } from '@playwright/test';

test.describe('Attach file icon', async () => {
  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl });
  });

  test('is not visible if filesharing options are undefined', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrl(serverUrl, users[0], { useFileSharing: 'false' }));
    await waitForChatCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-attach-file-icon-not-visible.png');
  });

  test('is visible if filesharing options are defined', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrl(serverUrl, users[0], { useFileSharing: 'true' }));
    await waitForChatCompositeToLoad(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-attach-file-icon-visible.png');
  });
});
