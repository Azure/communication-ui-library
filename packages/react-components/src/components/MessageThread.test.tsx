// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageThread } from './MessageThread';
import { ChatMessage } from '../types';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization, createTestLocale } from './utils/testUtils';
import { COMPONENT_LOCALE_EN_US } from '../localization/locales';

Enzyme.configure({ adapter: new Adapter() });

const twentyFourHoursAgo = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

const messageDateTimeLocale = (messageDate: Date): string => {
  const todayDate = new Date();

  const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (messageDate > yesterdayDate) {
    return '24 hours ago';
  } else {
    return ' ';
  }
};

const messageDateTime = (messageDate: Date): string => {
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

/* @conditional-compile-remove(dateTimeCustomization) */
describe('Message date should be customized by function passed through locale', () => {
  test('Message date should be localized to "24 hours ago"', async () => {
    const testLocale = { strings: COMPONENT_LOCALE_EN_US.strings, messageDateTimeLocale };
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

/* @conditional-compile-remove(dateTimeCustomization) */
describe('messageDateTime passed through messagethread should overwrite messageDateTimeLocale', () => {
  test('Message date should be localized to "yesterday"', async () => {
    const testLocale = { strings: COMPONENT_LOCALE_EN_US.strings, messageDateTimeLocale };
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
        messageDateTime={messageDateTime}
      />,
      testLocale
    );
    expect(component.text()).toContain('Yesterday');
  });
});
