// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageThread } from './MessageThread';
import { ChatMessage } from '../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../types';
/* @conditional-compile-remove(teams-inline-images) */
import { AttachmentDownloadResult, FileMetadata } from './FileDownloadCards';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
/* @conditional-compile-remove(date-time-customization) @conditional-compile-remove(data-loss-prevention) */
import { COMPONENT_LOCALE_EN_US } from '../localization/locales';
/* @conditional-compile-remove(date-time-customization) */
import { screen } from '@testing-library/react';
/* @conditional-compile-remove(teams-inline-images) */
import { act, render } from '@testing-library/react';
/* @conditional-compile-remove(data-loss-prevention) */ /* @conditional-compile-remove(teams-inline-images) */
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

/* @conditional-compile-remove(teams-inline-images) */
describe('Message should display inline image correctly', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        datalosspreventionprohibited: <></>
      }
    });
  });

  test('Message richtext/html img src should be correct', async () => {
    const expectedBeforeImgSrc = 'http://localhost/urlBeforeSrcReplacement';
    const expectedImgSrc = 'http://localhost/someImgSrcUrl';
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      content: `<p>Test</p><p><img alt="image" src="${expectedBeforeImgSrc}" itemscope="png" width="166.5625" height="250" id="SomeImageId1" style="vertical-align:bottom"></p><p>&nbsp;</p>`,
      senderDisplayName: 'Miguel Garcia',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'html',
      attachedFilesMetadata: [
        {
          id: 'SomeImageId1',
          name: 'SomeImageId1',
          attachmentType: 'teamsInlineImage',
          extension: 'png',
          url: 'images/inlineImageExample1.png',
          previewUrl: expectedImgSrc
        }
      ]
    };
    const onFetchAttachment = async (attachment: FileMetadata): Promise<AttachmentDownloadResult> => {
      return {
        blobUrl: attachment.previewUrl ?? ''
      };
    };

    render(<MessageThread userId="user1" messages={[sampleMessage]} onFetchAttachments={onFetchAttachment} />);
    expect((screen.getByRole('img') as HTMLImageElement).src).toEqual(expectedBeforeImgSrc);

    act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect((screen.getByRole('img') as HTMLImageElement).src).toEqual(expectedImgSrc);
    });
  });
});
