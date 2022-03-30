// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  waitForChatCompositeToLoad,
  buildUrl,
  isTestProfileStableFlavor,
  stubMessageTimestamps,
  dataUiId
} from '../common/utils';
import {
  chatTestSetup,
  sendMessage,
  waitForMessageDelivered,
  waitForMessageWithContent
} from '../common/chatTestHelpers';
import { test } from './fixture';
import { expect } from '@playwright/test';
import { IDS } from '../common/constants';

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

  test('shows file upload error', async ({ serverUrl, users, page }) => {
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
    expect(await page.screenshot()).toMatchSnapshot('filesharing-sendbox-file-upload-error.png');
  });

  test('shows file upload in progress error', async ({ serverUrl, users, page }) => {
    await page.goto(
      buildUrl(serverUrl, users[0], {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 0.5
          }
        ])
      })
    );
    await waitForChatCompositeToLoad(page);
    await sendMessage(page, 'Hi');
    await stubMessageTimestamps(page);
    expect(await page.screenshot()).toMatchSnapshot('filesharing-sendbox-file-upload-in-progress-error.png');
  });
});

test.describe('Filesharing Message Thread', async () => {
  test.skip(isTestProfileStableFlavor());

  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl });
  });

  test('contains File Download Card', async ({ serverUrl, users, pages }) => {
    const testMessageText = 'Hello!';
    const page0 = pages[0];
    await page0.goto(
      buildUrl(serverUrl, users[0], {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'SampleFile1.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            uploadComplete: true
          }
        ])
      })
    );
    await waitForChatCompositeToLoad(page0);
    await sendMessage(page0, testMessageText);
    await waitForMessageDelivered(page0);
    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('filesharing-file-download-card-in-sent-messages.png');

    const page1 = pages[1];
    await waitForChatCompositeToLoad(page1);
    await waitForMessageWithContent(page1, testMessageText);

    // It could be too slow to get typing indicator here, which makes the test flakey
    // so wait for typing indicator disappearing, @Todo: stub out typing indicator instead.
    await page1.waitForTimeout(1000); // ensure typing indicator has had time to appear
    const typingIndicator = await page1.$(dataUiId(IDS.typingIndicator));
    typingIndicator && (await typingIndicator.waitForElementState('hidden')); // ensure typing indicator has now disappeared

    await stubMessageTimestamps(page1);
    expect(await page1.screenshot()).toMatchSnapshot('filesharing-file-download-card-in-received-messages.png');
  });
});
