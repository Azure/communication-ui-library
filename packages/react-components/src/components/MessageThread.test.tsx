// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageThread } from './MessageThread';
import { ChatMessage } from '../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../types';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { AttachmentDownloadResult, FileMetadata } from './FileDownloadCards';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
/* @conditional-compile-remove(date-time-customization) @conditional-compile-remove(data-loss-prevention) */
import { COMPONENT_LOCALE_EN_US } from '../localization/locales';
/* @conditional-compile-remove(date-time-customization) */
import { screen } from '@testing-library/react';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { render, waitFor } from '@testing-library/react';
/* @conditional-compile-remove(data-loss-prevention) */ /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { registerIcons } from '@fluentui/react';

const twentyFourHoursAgo = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

/* @conditional-compile-remove(date-time-customization) */
const onDisplayDateTimeStringLocale = (messageDate: Date): string => {
  const todayDate = new Date();

  const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (messageDate > yesterdayDate) {
    return '24 hours ago';
  } else {
    return ' ';
  }
};

/* @conditional-compile-remove(date-time-customization) */
const onDisplayDateTimeString = (messageDate: Date): string => {
  const todayDate = new Date();

  const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (messageDate > yesterdayDate) {
    return 'Yesterday';
  } else {
    return ' ';
  }
};

describe('Message date should be formatted correctly', () => {
  test('Should locale string for "Yesterday"', async () => {
    const testLocale = createTestLocale({ messageThread: { yesterday: 'MOCK YESTERDAY' } });
    const sampleMessage: ChatMessage = {
      messageType: 'chat',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    const { container } = renderWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(container.textContent).toContain(testLocale.strings.messageThread.yesterday);
  });
});

/* @conditional-compile-remove(date-time-customization) */
describe('Message date should be customized by onDisplayDateTimeString passed through locale', () => {
  test('Message date should be localized to "24 hours ago"', async () => {
    const testLocale = {
      strings: COMPONENT_LOCALE_EN_US.strings,
      onDisplayDateTimeString: onDisplayDateTimeStringLocale
    };
    const sampleMessage: ChatMessage = {
      messageType: 'chat',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    renderWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(screen.getByText('24 hours ago')).toBeTruthy();
  });
});

/* @conditional-compile-remove(date-time-customization) */
describe('onDisplayDateTimeString passed through messagethread should overwrite onDisplayDateTimeString from locale', () => {
  test('Message date should be localized to "yesterday"', async () => {
    const testLocale = {
      strings: COMPONENT_LOCALE_EN_US.strings,
      onDisplayDateTimeString: onDisplayDateTimeStringLocale
    };
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    renderWithLocalization(
      <MessageThread
        userId="user1"
        messages={[sampleMessage]}
        showMessageDate={true}
        onDisplayDateTimeString={onDisplayDateTimeString}
      />,
      testLocale
    );
    expect(screen.getByText('Yesterday')).toBeTruthy();
  });
});

/* @conditional-compile-remove(data-loss-prevention) */
describe('Message blocked should display default blocked text correctly', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        datalosspreventionprohibited: <></>
      }
    });
  });

  test('Should locale string for default message blocked by policy"', async () => {
    const testLocale = createTestLocale({ messageThread: { yesterday: Math.random().toString() } });
    const sampleMessage: BlockedMessage = {
      messageType: 'blocked',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false
    };
    renderWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(screen.getByText(testLocale.strings.messageThread.blockedWarningText)).toBeTruthy();
  });
});

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
describe.only('Message should display image and attachment correctly', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        datalosspreventionprohibited: <></>,
        downloadfile: <></>
      }
    });
  });

  test('Message richtext/html img src should be correct', async () => {
    const imgId1 = 'SomeImageId1';
    const imgId2 = 'SomeImageId2';
    const expectedImgSrc1 = 'http://localhost/someImgSrcUrl1';
    const expectedImgSrc2 = 'http://localhost/someImgSrcUrl2';
    const expectedOnFetchAttachmentCount = 2;
    let onFetchAttachmentCount = 0;
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      content: `<p>Test</p><p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="${imgId1}" style="vertical-align:bottom"></p><p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="${imgId2}" style="vertical-align:bottom"></p><p>&nbsp;</p>`,
      senderDisplayName: 'Miguel Garcia',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'html',
      attachedFilesMetadata: [
        {
          id: imgId1,
          name: imgId1,
          attachmentType: 'teamsInlineImage',
          extension: 'png',
          url: expectedImgSrc1,
          previewUrl: expectedImgSrc1
        },
        {
          id: imgId2,
          name: imgId2,
          attachmentType: 'teamsInlineImage',
          extension: 'png',
          url: expectedImgSrc2,
          previewUrl: expectedImgSrc2
        }
      ]
    };
    const onFetchAttachment = async (attachment: FileMetadata): Promise<AttachmentDownloadResult[]> => {
      onFetchAttachmentCount++;
      return [
        {
          blobUrl: attachment.previewUrl ?? ''
        }
      ];
    };

    const { container } = render(
      <MessageThread userId="user1" messages={[sampleMessage]} onFetchAttachments={onFetchAttachment} />
    );

    await waitFor(async () => {
      expect(container.querySelector(`#${imgId1}`)?.getAttribute('src')).toEqual(expectedImgSrc1);
      expect(container.querySelector(`#${imgId2}`)?.getAttribute('src')).toEqual(expectedImgSrc2);
      expect(onFetchAttachmentCount).toEqual(expectedOnFetchAttachmentCount);
    });
  });

  test('Message richtext/html fileSharing and inline image attachment should display correctly', async () => {
    const fildId1 = 'SomeFileId1';
    const fildId2 = 'SomeFileId2';
    const fildName1 = 'SomeFileId1.txt';
    const fildName2 = 'SomeFileId2.pdf';
    const expectedFileSrc1 = 'http://localhost/someFileSrcUrl1';
    const expectedFileSrc2 = 'http://localhost/someFileSrcUrl2';
    const expectedFilePreviewSrc1 = 'http://localhost/someFilePreviewSrcUrl1';

    const imgId1 = 'SomeImageId1';
    const expectedImgSrc1 = 'http://localhost/someImgSrcUrl1';
    const expectedOnFetchInlineImageAttachmentCount = 1;
    let onFetchAttachmentCount = 0;
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      content: `<p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="${imgId1}" style="vertical-align:bottom"></p>`,
      senderDisplayName: 'Miguel Garcia',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'html',
      attachedFilesMetadata: [
        {
          id: imgId1,
          name: imgId1,
          attachmentType: 'teamsInlineImage',
          extension: 'png',
          url: expectedImgSrc1,
          previewUrl: expectedImgSrc1
        },
        {
          id: fildId1,
          name: fildName1,
          attachmentType: 'fileSharing',
          extension: 'txt',
          url: expectedFileSrc1,
          previewUrl: expectedFilePreviewSrc1
        },
        {
          id: fildId2,
          name: fildName2,
          attachmentType: 'fileSharing',
          extension: 'pdf',
          url: expectedFileSrc2
        }
      ]
    };
    const onFetchAttachment = async (attachment: FileMetadata): Promise<AttachmentDownloadResult[]> => {
      onFetchAttachmentCount++;
      return [
        {
          blobUrl: attachment.previewUrl ?? ''
        }
      ];
    };

    const { container } = render(
      <MessageThread userId="user1" messages={[sampleMessage]} onFetchAttachments={onFetchAttachment} />
    );

    await waitFor(async () => {
      const DownloadFileIconName = 'DownloadFile';
      const fileDownloadCards = container.querySelector('[data-ui-id="file-download-card-group"]')?.firstElementChild;

      // Frist attachment: previewUrl !== undefine, will not show DownloadFile Icon
      expect(fileDownloadCards?.children[0].innerHTML).not.toContain(DownloadFileIconName);
      expect(fileDownloadCards?.children[0].textContent).toEqual(fildName1);

      // Second attachment: previewUrl === undefined, will show DownloadFile Icon
      expect(fileDownloadCards?.children[1].innerHTML).toContain(DownloadFileIconName);
      expect(fileDownloadCards?.children[1].textContent).toEqual(fildName2);

      // Inline Image attachment
      expect(container.querySelector(`#${imgId1}`)?.getAttribute('src')).toEqual(expectedImgSrc1);
      expect(onFetchAttachmentCount).toEqual(expectedOnFetchInlineImageAttachmentCount);
    });
  });
});
