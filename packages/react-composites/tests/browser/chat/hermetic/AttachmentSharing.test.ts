// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { sendMessage, waitForMessageDelivered } from '../../common/chatTestHelpers';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test, TEST_PARTICIPANTS } from './fixture';

/* @conditional-compile-remove(attachment-upload) */
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

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
test.describe('Filesharing Global Errorbar', async () => {
  test('shows file download error', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        attachmentUploads: [
          {
            id: 'SomeMockId',
            name: 'Sample.pdf',
            progress: 1,
            url: 'https://sample.com/SampleFile.pdf',
            attachmentType: 'file'
          }
        ],
        failFileDownload: true
      })
    );
    const testMessageText = 'Hello!';
    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    await waitForSelector(page, dataUiId('attachment-download-card-group'));

    await page.locator(dataUiId('attachment-download-card-download-icon')).click();
    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-download-error.png');
  });
});

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
test.describe('Filesharing Message Thread', async () => {
  test('contains File Download Card', async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        attachmentUploads: [
          {
            id: 'SomeMockId',
            name: 'SampleFile1.pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 1,
            attachmentType: 'file'
          }
        ]
      })
    );
    const testMessageText = 'Hello!';

    await sendMessage(page, testMessageText);
    await page.waitForSelector(dataUiId('attachment-download-card-group'));

    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-file-download-card-in-sent-messages.png');
  });

  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
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

/* @conditional-compile-remove(attachment-upload) */
test.describe('Filesharing Edit Message', async () => {
  test.beforeEach(async ({ serverUrl, page }) => {
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        attachmentUploads: [
          {
            id: 'SomeMockId',
            name: 'SampleFile1.pdf',
            url: 'https://sample.com/SampleFile.pdf',
            progress: 1,
            attachmentType: 'file'
          }
        ]
      })
    );
  });

  test('displays attachment upload cards', async ({ page }) => {
    const testMessageText = 'Hello!';

    await sendMessage(page, testMessageText);
    await waitForMessageDelivered(page);
    await page.waitForSelector(dataUiId('attachment-download-card-group'));
    await page.locator(dataUiId('chat-composite-message')).click();
    await page.locator(dataUiId('chat-composite-message-action-icon')).click();
    await page.waitForSelector(dataUiId('chat-composite-message-contextual-menu-edit-action'));
    await page.locator(dataUiId('chat-composite-message-contextual-menu-edit-action')).click();
    await page.waitForSelector(dataUiId('edit-box'));

    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-file-upload-card-while-editing-message.png');
  });
});
