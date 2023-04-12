// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { expect } from '@playwright/test';
import { sendMessage, waitForMessageDelivered } from '../../common/chatTestHelpers';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test, TEST_PARTICIPANTS } from './fixture';

/* @conditional-compile-remove(file-sharing) */
test.describe('Filesharing Attach file icon', async () => {
  test('is not visible if filesharing options are undefined', async ({ serverUrl, page }) => {
    await page.goto(buildUrlForChatAppUsingFakeAdapter(serverUrl, DEFAULT_FAKE_CHAT_ADAPTER_ARGS));
    expect(
      await stableScreenshot(page, { stubMessageTimestamps: true, dismissChatMessageActions: true })
    ).toMatchSnapshot('filesharing-attach-file-icon-not-visible.png');
  });

  test('is visible if filesharing options are defined', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, { ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS, fileSharingEnabled: true })
    );
    expect(
      await stableScreenshot(page, { stubMessageTimestamps: true, dismissChatMessageActions: true })
    ).toMatchSnapshot('filesharing-attach-file-icon-visible.png');
  });
});

/* @conditional-compile-remove(file-sharing) */
test.describe('Filesharing SendBox', async () => {
  test('shows file cards for uploaded files', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        fileUploads: [
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            attachmentType: 'fileSharing',
            id: ''
          },
          {
            name: 'SampleXlsLoooongName.xlsx',
            extension: 'xslx',
            url: 'https://sample.com/SampleXls.xlsx',
            attachmentType: 'fileSharing',
            id: ''
          }
        ]
      })
    );
    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-sendbox-filecards.png');
  });
});

/* @conditional-compile-remove(file-sharing) */
test.describe('Filesharing ProgressBar', async () => {
  test('is visible if progress is between 0 and 1', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        fileUploads: [
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 0.5,
            attachmentType: 'fileSharing',
            id: ''
          },
          {
            name: 'SampleXlsLoooongName.xlsx',
            extension: 'xslx',
            url: 'https://sample.com/SampleXls.xlsx',
            progress: 0.8,
            attachmentType: 'fileSharing',
            id: ''
          }
        ]
      })
    );
    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-progress-bar-visible.png');
  });

  test('is not visible if progress is 0 or less than 0', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        fileUploads: [
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 0,
            attachmentType: 'fileSharing',
            id: ''
          },
          {
            name: 'SampleXlsLoooongName.xlsx',
            extension: 'xslx',
            url: 'https://sample.com/SampleXls.xlsx',
            progress: -1,
            attachmentType: 'fileSharing',
            id: ''
          }
        ]
      })
    );
    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-progress-bar-not-visible-progress-less-than-zero.png');
  });

  test('is not visible if progress is 1 or greater than 1', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        fileUploads: [
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 1,
            attachmentType: 'fileSharing',
            id: ''
          },
          {
            name: 'SampleXlsLoooongName.xlsx',
            extension: 'xslx',
            url: 'https://sample.com/SampleXls.xlsx',
            progress: 10,
            attachmentType: 'fileSharing',
            id: ''
          }
        ]
      })
    );
    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-progress-bar-not-visible-progress-greater-than-one.png');
  });
});

/* @conditional-compile-remove(file-sharing) */
test.describe('Filesharing SendBox Errorbar', async () => {
  test('shows file upload error', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        fileUploads: [
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            error: 'File too big. Select a file under 99 MB.',
            attachmentType: 'fileSharing',
            id: ''
          }
        ]
      })
    );
    expect(
      await stableScreenshot(page, { stubMessageTimestamps: true, dismissChatMessageActions: true })
    ).toMatchSnapshot('filesharing-sendbox-file-upload-error.png');
  });

  test('shows file upload in progress error', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        fileUploads: [
          {
            name: 'SampleFile.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 0.5,
            attachmentType: 'fileSharing',
            id: ''
          }
        ]
      })
    );
    await sendMessage(page, 'Hi');
    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-sendbox-file-upload-in-progress-error.png');
  });
});

/* @conditional-compile-remove(file-sharing) */
test.describe('Filesharing Global Errorbar', async () => {
  test('shows file download error', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        fileUploads: [
          {
            name: 'Sample.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            attachmentType: 'fileSharing',
            id: ''
          }
        ],
        failFileDownload: true
      })
    );
    const testMessageText = 'Hello!';
    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    await waitForSelector(page, dataUiId('file-download-card-group'));

    await page.locator(dataUiId('file-download-card-download-icon')).click();
    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-download-error.png');
  });
});

/* @conditional-compile-remove(file-sharing) */
test.describe('Filesharing Message Thread', async () => {
  test('contains File Download Card', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        fileUploads: [
          {
            name: 'SampleFile1.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            uploadComplete: true,
            attachmentType: 'fileSharing',
            id: ''
          }
        ]
      })
    );
    const testMessageText = 'Hello!';

    await sendMessage(page, testMessageText);
    await page.waitForSelector(dataUiId('file-download-card-group'));

    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-file-download-card-in-sent-messages.png');
  });

  test('contains File Download Card in remote message', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        localParticipant: TEST_PARTICIPANTS[1],
        remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
        localParticipantPosition: 1,
        fileSharingEnabled: true,
        sendRemoteFileSharingMessage: true
      })
    );

    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-file-download-card-in-received-messages.png');
  });
});

/* @conditional-compile-remove(teams-inline-images) */
test.describe.only('Inline Image Message Thread', async () => {
  test.only('contains Inline Image in remote message', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        localParticipant: TEST_PARTICIPANTS[1],
        remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
        localParticipantPosition: 1,
        sendRemoteInlineImageMessage: true
      })
    );

    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true
      })
    ).toMatchSnapshot('inline-image-in-received-messages.png');
  });
});

/* @conditional-compile-remove(file-sharing) */
test.describe('Filesharing Edit Message', async () => {
  test.beforeEach(async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        fileUploads: [
          {
            name: 'SampleFile1.pdf',
            extension: 'pdf',
            url: 'https://sample.com/SampleFile.pdf',
            uploadComplete: true,
            attachmentType: 'fileSharing',
            id: ''
          }
        ]
      })
    );
  });

  test('displays file upload cards', async ({ page }) => {
    const testMessageText = 'Hello!';

    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    await page.waitForSelector(dataUiId('file-download-card-group'));
    await page.locator(dataUiId('chat-composite-message')).click();
    await page.locator(dataUiId('chat-composite-message-action-icon')).click();
    await page.waitForSelector('[id="chat-composite-message-contextual-menu"]');
    await page.locator(dataUiId('chat-composite-message-contextual-menu-edit-action')).click();
    await page.waitForSelector('[id="editbox"]');

    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-file-upload-card-while-editing-message.png');
  });
});
