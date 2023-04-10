// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageThread } from './MessageThread';
import { ChatMessage } from '../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../types';
/* @conditional-compile-remove(teams-inline-images) */
import { FileMetadata } from './FileDownloadCards';
/* @conditional-compile-remove(teams-inline-images) */
import { act } from 'react-dom/test-utils';
import Enzyme from 'enzyme';
/* @conditional-compile-remove(teams-inline-images) */
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization, createTestLocale } from './utils/testUtils';
/* @conditional-compile-remove(date-time-customization) @conditional-compile-remove(data-loss-prevention) */
import { COMPONENT_LOCALE_EN_US } from '../localization/locales';

Enzyme.configure({ adapter: new Adapter() });

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
    const testLocale = createTestLocale({ messageThread: { yesterday: Math.random().toString() } });
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
    const component = mountWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(component.text()).toContain(testLocale.strings.messageThread.yesterday);
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
    const component = mountWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(component.text()).toContain('24 hours ago');
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
    const component = mountWithLocalization(
      <MessageThread
        userId="user1"
        messages={[sampleMessage]}
        showMessageDate={true}
        onDisplayDateTimeString={onDisplayDateTimeString}
      />,
      testLocale
    );
    expect(component.text()).toContain('Yesterday');
  });
});

/* @conditional-compile-remove(data-loss-prevention) */
describe('Message blocked should display default blocked text correctly', () => {
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
    const component = mountWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(component.text()).toContain(testLocale.strings.messageThread.blockedWarningText);
  });
});

/* @conditional-compile-remove(teams-inline-images) */
describe('Message should display inline image correctly', () => {
  test('Message richtext/html img src should be correct', async () => {
    const expectedImgSrc = 'someImgSrcUrl';
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      content:
        '<p>Test</p><p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="SomeImageId1" style="vertical-align:bottom"></p><p>&nbsp;</p>',
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
    const onFetchAttachment = async (attachment: FileMetadata): Promise<string> => {
      return attachment.previewUrl ?? '';
    };
    const component = mount(
      <MessageThread userId="user1" messages={[sampleMessage]} onFetchAttachments={onFetchAttachment} />
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      component.update();

      expect(component.find('img').prop('src')).toEqual(expectedImgSrc);
    });
  });
});
