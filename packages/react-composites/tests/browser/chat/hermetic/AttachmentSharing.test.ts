// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { expect } from '@playwright/test';
import { sendMessage, waitForMessageDelivered } from '../../common/chatTestHelpers';
import { dataUiId, stableScreenshot, waitForSelector } from '../../common/utils';
import { buildUrlForChatAppUsingFakeAdapter, DEFAULT_FAKE_CHAT_ADAPTER_ARGS, test, TEST_PARTICIPANTS } from './fixture';
import { AttachmentUploadTask } from '../../../../../react-components/dist/dist-esm';
import { nanoid } from 'nanoid';

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

/* @conditional-compile-remove(attachment-upload) */
test.describe('Filesharing SendBox', async () => {
  test('shows file cards for uploaded files', async ({ serverUrl, page }) => {
    const attachmentUploads = [
      {
        id: 'SomeMockId',
        name: 'SampleFile.pdf',
        progress: 1,
        extension: 'pdf',
        url: 'https://sample.com/SampleFile.pdf',
        attachmentType: 'file'
      },
      {
        id: 'SomeMockId',
        name: 'SampleXlsLoooongName.xlsx',
        progress: 1,
        extension: 'xslx',
        url: 'https://sample.com/SampleXls.xlsx',
        attachmentType: 'file'
      }
    ];
    await page.goto(
      buildUrlForChatAppUsingFakeAdapter(serverUrl, {
        ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
        fileSharingEnabled: true,
        uploadHandler: (tasks: AttachmentUploadTask[]) => {
          for (const task of tasks) {
            task.notifyUploadCompleted(nanoid(), 'https://sample.com/SampleFile.pdf');
          }
        }
      })
    );

    // Click on the attachment upload button
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator(dataUiId('attachment-upload-button')).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      {
        name: 'SampleFile.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test')
      },
      {
        name: 'SampleXlsLoooongName.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: Buffer.from('test')
      }
    ]);

    expect(
      await stableScreenshot(page, {
        stubMessageTimestamps: true,
        dismissChatMessageActions: true,
        awaitFileTypeIcon: true
      })
    ).toMatchSnapshot('filesharing-sendbox-filecards.png');
  });
});

// /* @conditional-compile-remove(attachment-upload) */
// test.describe('Filesharing ProgressBar', async () => {
//   test('is visible if progress is between 0 and 1', async ({ serverUrl, page }) => {
//     await page.goto(
//       buildUrlForChatAppUsingFakeAdapter(serverUrl, {
//         ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
//         fileSharingEnabled: true,
//         attachmentUploads: [
//           {
//             id: 'SomeMockId',
//             name: 'SampleFile.pdf',
//             extension: 'pdf',
//             url: 'https://sample.com/SampleFile.pdf',
//             progress: 0.5,
//             attachmentType: 'file'
//           },
//           {
//             id: 'SomeMockId',
//             name: 'SampleXlsLoooongName.xlsx',
//             extension: 'xslx',
//             url: 'https://sample.com/SampleXls.xlsx',
//             progress: 0.8,
//             attachmentType: 'file'
//           }
//         ]
//       })
//     );
//     expect(
//       await stableScreenshot(page, {
//         stubMessageTimestamps: true,
//         dismissChatMessageActions: true,
//         awaitFileTypeIcon: true
//       })
//     ).toMatchSnapshot('filesharing-progress-bar-visible.png');
//   });

//   test('is not visible if progress is 0 or less than 0', async ({ serverUrl, page }) => {
//     await page.goto(
//       buildUrlForChatAppUsingFakeAdapter(serverUrl, {
//         ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
//         fileSharingEnabled: true,
//         attachmentUploads: [
//           {
//             id: 'SomeMockId',
//             name: 'SampleFile.pdf',
//             extension: 'pdf',
//             url: 'https://sample.com/SampleFile.pdf',
//             progress: 0,
//             attachmentType: 'file'
//           },
//           {
//             id: 'SomeMockId',
//             name: 'SampleXlsLoooongName.xlsx',
//             extension: 'xslx',
//             url: 'https://sample.com/SampleXls.xlsx',
//             progress: -1,
//             attachmentType: 'file'
//           }
//         ]
//       })
//     );
//     expect(
//       await stableScreenshot(page, {
//         stubMessageTimestamps: true,
//         dismissChatMessageActions: true,
//         awaitFileTypeIcon: true
//       })
//     ).toMatchSnapshot('filesharing-progress-bar-not-visible-progress-less-than-zero.png');
//   });

//   test('is not visible if progress is 1 or greater than 1', async ({ serverUrl, page }) => {
//     await page.goto(
//       buildUrlForChatAppUsingFakeAdapter(serverUrl, {
//         ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
//         fileSharingEnabled: true,
//         attachmentUploads: [
//           {
//             id: 'SomeMockId',
//             name: 'SampleFile.pdf',
//             extension: 'pdf',
//             url: 'https://sample.com/SampleFile.pdf',
//             progress: 1,
//             attachmentType: 'file'
//           },
//           {
//             id: 'SomeMockId',
//             name: 'SampleXlsLoooongName.xlsx',
//             extension: 'xslx',
//             url: 'https://sample.com/SampleXls.xlsx',
//             progress: 10,
//             attachmentType: 'file'
//           }
//         ]
//       })
//     );
//     expect(
//       await stableScreenshot(page, {
//         stubMessageTimestamps: true,
//         dismissChatMessageActions: true,
//         awaitFileTypeIcon: true
//       })
//     ).toMatchSnapshot('filesharing-progress-bar-not-visible-progress-greater-than-one.png');
//   });
// });

// /* @conditional-compile-remove(attachment-upload) */
// test.describe('Filesharing SendBox Errorbar', async () => {
//   test('shows attachment upload error', async ({ serverUrl, page }) => {
//     await page.goto(
//       buildUrlForChatAppUsingFakeAdapter(serverUrl, {
//         ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
//         fileSharingEnabled: true,
//         attachmentUploads: [
//           {
//             id: 'SomeMockId',
//             name: 'SampleFile.pdf',
//             extension: 'pdf',
//             progress: 1,
//             url: 'https://sample.com/SampleFile.pdf',
//             error: 'File too big. Select a file under 99 MB.',
//             attachmentType: 'file'
//           }
//         ]
//       })
//     );
//     expect(
//       await stableScreenshot(page, { stubMessageTimestamps: true, dismissChatMessageActions: true })
//     ).toMatchSnapshot('filesharing-sendbox-file-upload-error.png');
//   });

//   test('shows attachment upload in progress error', async ({ serverUrl, page }) => {
//     await page.goto(
//       buildUrlForChatAppUsingFakeAdapter(serverUrl, {
//         ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
//         fileSharingEnabled: true,
//         attachmentUploads: [
//           {
//             id: 'SomeMockId',
//             name: 'SampleFile.pdf',
//             extension: 'pdf',
//             url: 'https://sample.com/SampleFile.pdf',
//             progress: 0.5,
//             attachmentType: 'file'
//           }
//         ]
//       })
//     );
//     await sendMessage(page, 'Hi');
//     expect(
//       await stableScreenshot(page, {
//         stubMessageTimestamps: true,
//         dismissChatMessageActions: true,
//         awaitFileTypeIcon: true
//       })
//     ).toMatchSnapshot('filesharing-sendbox-file-upload-in-progress-error.png');
//   });
// });

// /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
// test.describe('Filesharing Global Errorbar', async () => {
//   test('shows file download error', async ({ serverUrl, page }) => {
//     await page.goto(
//       buildUrlForChatAppUsingFakeAdapter(serverUrl, {
//         ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
//         fileSharingEnabled: true,
//         attachmentUploads: [
//           {
//             id: 'SomeMockId',
//             name: 'Sample.pdf',
//             progress: 1,
//             extension: 'pdf',
//             url: 'https://sample.com/SampleFile.pdf',
//             attachmentType: 'file'
//           }
//         ],
//         failFileDownload: true
//       })
//     );
//     const testMessageText = 'Hello!';
//     await sendMessage(page, testMessageText);
//     await waitForMessageDelivered(page);
//     await waitForSelector(page, dataUiId('attachment-download-card-group'));

//     await page.locator(dataUiId('attachment-download-card-download-icon')).click();
//     expect(
//       await stableScreenshot(page, {
//         stubMessageTimestamps: true,
//         dismissChatMessageActions: true,
//         awaitFileTypeIcon: true
//       })
//     ).toMatchSnapshot('filesharing-download-error.png');
//   });
// });

// /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
// test.describe('Filesharing Message Thread', async () => {
//   test('contains File Download Card', async ({ serverUrl, page }) => {
//     await page.goto(
//       buildUrlForChatAppUsingFakeAdapter(serverUrl, {
//         ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
//         fileSharingEnabled: true,
//         attachmentUploads: [
//           {
//             id: 'SomeMockId',
//             name: 'SampleFile1.pdf',
//             extension: 'pdf',
//             url: 'https://sample.com/SampleFile.pdf',
//             progress: 1,
//             attachmentType: 'file'
//           }
//         ]
//       })
//     );
//     const testMessageText = 'Hello!';

//     await sendMessage(page, testMessageText);
//     await page.waitForSelector(dataUiId('attachment-download-card-group'));

//     expect(
//       await stableScreenshot(page, {
//         stubMessageTimestamps: true,
//         dismissChatMessageActions: true,
//         awaitFileTypeIcon: true
//       })
//     ).toMatchSnapshot('filesharing-file-download-card-in-sent-messages.png');
//   });

//   /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
//   test('contains File Download Card in remote message', async ({ serverUrl, page }) => {
//     await page.goto(
//       buildUrlForChatAppUsingFakeAdapter(serverUrl, {
//         localParticipant: TEST_PARTICIPANTS[1],
//         remoteParticipants: [TEST_PARTICIPANTS[0], TEST_PARTICIPANTS[2]],
//         localParticipantPosition: 1,
//         fileSharingEnabled: true,
//         sendRemoteFileSharingMessage: true
//       })
//     );

//     expect(
//       await stableScreenshot(page, {
//         stubMessageTimestamps: true,
//         dismissChatMessageActions: true,
//         awaitFileTypeIcon: true
//       })
//     ).toMatchSnapshot('filesharing-file-download-card-in-received-messages.png');
//   });
// });

// /* @conditional-compile-remove(attachment-upload) */
// test.describe('Filesharing Edit Message', async () => {
//   test.beforeEach(async ({ serverUrl, page }) => {
//     await page.goto(
//       buildUrlForChatAppUsingFakeAdapter(serverUrl, {
//         ...DEFAULT_FAKE_CHAT_ADAPTER_ARGS,
//         fileSharingEnabled: true,
//         attachmentUploads: [
//           {
//             id: 'SomeMockId',
//             name: 'SampleFile1.pdf',
//             extension: 'pdf',
//             url: 'https://sample.com/SampleFile.pdf',
//             progress: 1,
//             attachmentType: 'file'
//           }
//         ]
//       })
//     );
//   });

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
// });
