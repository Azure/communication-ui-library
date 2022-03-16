// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  waitForChatCompositeToLoad,
  buildUrl,
  isTestProfileStableFlavor,
  stubMessageTimestamps
} from '../common/utils';
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

test.describe('Filesharing ProgressBar', async () => {
  test.skip(isTestProfileStableFlavor());

  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl });
  });

  test('is visible if progress is between 0 and 1', async ({ serverUrl, users, page }) => {
    await page.goto(
      buildUrl(serverUrl, users[0], {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 0.5
          },
          {
            name: 'SampleXlsLoooongName.xlsx',
            extension: 'xslx',
            url: 'https://sample.com/SampleXls.xlsx',
            progress: 0.8
          }
        ])
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-progress-bar-visible.png');
  });

  test('is not visible if progress is 0 or less than 0', async ({ serverUrl, users, page }) => {
    await page.goto(
      buildUrl(serverUrl, users[0], {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 0
          },
          {
            name: 'SampleXlsLoooongName.xlsx',
            extension: 'xslx',
            url: 'https://sample.com/SampleXls.xlsx',
            progress: -1
          }
        ])
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-progress-bar-not-visible-progress-less-than-zero.png');
  });

  test('is not visible if progress is 1 or greater than 1', async ({ serverUrl, users, page }) => {
    await page.goto(
      buildUrl(serverUrl, users[0], {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 1
          },
          {
            name: 'SampleXlsLoooongName.xlsx',
            extension: 'xslx',
            url: 'https://sample.com/SampleXls.xlsx',
            progress: 10
          }
        ])
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot(
      'filesharing-progress-bar-not-visible-progress-greater-than-one.png'
    );
  });
});

test.describe('Filesharing SendBox Errorbar', async () => {
  test.skip(isTestProfileStableFlavor());

  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl });
  });

  test('shows file too big error', async ({ serverUrl, users, page }) => {
    await page.goto(
      buildUrl(serverUrl, users[0], {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            error: 'File too big. Select a file under 99 MB.'
          }
        ])
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-sendbox-errorbar-file-too-big.png');
  });
  test('shows file upload failed error', async ({ serverUrl, users, page }) => {
    await page.goto(
      buildUrl(serverUrl, users[0], {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'router-settings.docx',
            extension: 'docx',
            url: 'https://sample.com/router-settings.docx',
            error: 'There was a problem uploading “router-settings.docx” Try again.'
          }
        ])
      })
    );
    await waitForChatCompositeToLoad(page);
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-sendbox-errorbar-file-upload-failed.png');
  });
});
