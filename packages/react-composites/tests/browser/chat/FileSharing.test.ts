// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { waitForChatCompositeToLoad, buildUrl, isTestProfileStableFlavor, stubMessageTimestamps } from '../common/utils';
import { chatTestSetup } from '../common/chatTestHelpers';
import { test } from './fixture';
import { expect } from '@playwright/test';

test.describe('Filesharing Attach file icon', async () => {
  test.skip(isTestProfileStableFlavor());

  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl });
  });

  test('is not visible if filesharing options are undefined', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrl(serverUrl, users[0]));
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-attach-file-icon-not-visible.png');
  });

  test('is visible if filesharing options are defined', async ({ serverUrl, users, page }) => {
    await page.goto(buildUrl(serverUrl, users[0], { useFileSharing: 'true' }));
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-attach-file-icon-visible.png');
  });
});

test.describe('Filesharing SendBox', async () => {
  test.skip(isTestProfileStableFlavor());

  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl });
  });

  test('shows file cards for uploaded files', async ({ serverUrl, users, page }) => {
    await page.goto(
      buildUrl(serverUrl, users[0], {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf'
          },
          {
            name: 'SampleXlsLoooongName.xlsx',
            extension: 'xslx',
            url: 'https://sample.com/SampleXls.xlsx'
          }
        ])
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-sendbox-filecards.png');
  });
});
