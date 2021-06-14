// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageThread } from '../MessageThread';
import { ChatMessage } from '../../types';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization } from './enzymeUtils';
import { act } from 'react-dom/test-utils';
import germanStrings from '../../localization/translated/de.json';

Enzyme.configure({ adapter: new Adapter() });

const twentyFourHoursAgo = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

describe('Message date should be formatted correctly', () => {
  test('Should translate "Yesterday" to German', async () => {
    const sampleMessage: ChatMessage = {
      type: 'chat',
      payload: {
        senderId: 'user3',
        senderDisplayName: 'Sam Fisher',
        messageId: Math.random().toString(),
        content: 'Thanks for making my job easier.',
        createdOn: twentyFourHoursAgo(),
        mine: false,
        attached: false,
        type: 'text'
      }
    };
    const component = mountWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      germanStrings
    );
    await act(async () => component);
    expect(component.html()).toContain(germanStrings.yesterday);
  });
});
