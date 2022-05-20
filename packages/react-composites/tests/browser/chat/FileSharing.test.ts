// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  waitForChatCompositeToLoad,
  buildUrl,
  isTestProfileStableFlavor,
  stubMessageTimestamps,
  dataUiId,
  waitForSelector
} from '../common/utils';
import {
  chatTestSetup,
  chatTestSetupWithPerUserArgs,
  sendMessage,
  waitForMessageDelivered,
  waitForTypingIndicatorHidden
} from '../common/chatTestHelpers';
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

test.describe('Filesharing Global Errorbar', async () => {
  test.skip(isTestProfileStableFlavor());

  test.beforeEach(async ({ pages, users, serverUrl }) => {
    await chatTestSetup({ pages, users, serverUrl });
  });

  test('shows file download error', async ({ serverUrl, users, page }) => {
    await page.goto(
      buildUrl(serverUrl, users[0], {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'Sample.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf'
          }
        ]),
        failDownload: 'true'
      })
    );
    await waitForChatCompositeToLoad(page);
    const testMessageText = 'Hello!';
    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    await waitForSelector(page, dataUiId('file-download-card-group'));
    await stubMessageTimestamps(page);

    await page.locator(dataUiId('file-download-card-download-icon')).click();
    await page.addStyleTag({ content: '.ui-chat__message__actions {display: none}' });
    expect(await page.screenshot()).toMatchSnapshot('filesharing-download-error.png');
  });
});

test.describe('Filesharing Message Thread', async () => {
  test.skip(isTestProfileStableFlavor());

  test.beforeEach(async ({ pages, users, serverUrl }) => {
    const firstUserArgs = {
      user: users[0],
      qArgs: {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'SampleFile1.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            uploadComplete: true
          }
        ])
      }
    };
    const otherUsersArgs = users.slice(1).map((user) => ({
      user,
      qArgs: {
        useFileSharing: 'true'
      }
    }));
    const usersWithArgs = [firstUserArgs, ...otherUsersArgs];
    await chatTestSetupWithPerUserArgs({
      pages,
      usersWithArgs,
      serverUrl
    });
  });
  test('contains File Download Card', async ({ pages }) => {
    const testMessageText = 'Hello!';
    const page0 = pages[0];

    await waitForChatCompositeToLoad(page0);
    await sendMessage(page0, testMessageText);
    await waitForMessageDelivered(page0);
    await page0.waitForSelector(dataUiId('file-download-card-group'));

    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('filesharing-file-download-card-in-sent-messages.png');

    const page1 = pages[1];
    await waitForTypingIndicatorHidden(page1);

    await stubMessageTimestamps(page1);
    expect(await page1.screenshot()).toMatchSnapshot('filesharing-file-download-card-in-received-messages.png');
  });
});

test.describe('Filesharing Edit Message', async () => {
  test.skip(isTestProfileStableFlavor());

  test.beforeEach(async ({ pages, users, serverUrl }) => {
    const firstUserArgs = {
      user: users[0],
      qArgs: {
        useFileSharing: 'true',
        uploadedFiles: JSON.stringify([
          {
            name: 'SampleFile1.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            uploadComplete: true
          }
        ])
      }
    };
    const otherUsersArgs = users.slice(1).map((user) => ({
      user,
      qArgs: {
        useFileSharing: 'true'
      }
    }));
    const usersWithArgs = [firstUserArgs, ...otherUsersArgs];
    await chatTestSetupWithPerUserArgs({
      pages,
      usersWithArgs,
      serverUrl
    });
  });

  test('displays file upload cards', async ({ pages }) => {
    const testMessageText = 'Hello!';
    const page0 = pages[0];

    await waitForChatCompositeToLoad(page0);
    await sendMessage(page0, testMessageText);
    await waitForMessageDelivered(page0);
    await page0.waitForSelector(dataUiId('file-download-card-group'));
    await page0.locator(dataUiId('chat-composite-message')).click();
    await page0.locator(dataUiId('chat-composite-message-action-icon')).click();
    await page0.waitForSelector('[id="chat-composite-message-contextual-menu"]');
    await page0.locator(dataUiId('chat-composite-message-contextual-menu-edit-action')).click();
    await page0.waitForSelector('[id="editbox"]');

    await stubMessageTimestamps(page0);
    expect(await page0.screenshot()).toMatchSnapshot('filesharing-file-upload-card-while-editing-message.png');
  });
});
