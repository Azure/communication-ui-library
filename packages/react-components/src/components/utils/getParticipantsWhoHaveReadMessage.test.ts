// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '../..';
import getParticipantsWhoHaveReadMessage from './getParticipantsWhoHaveReadMessage';

const chatMessage = (messageID: string): ChatMessage => ({
  messageId: messageID,
  messageType: 'chat',
  contentType: 'text',
  createdOn: new Date(0)
});

const startTime = new Date('2022-01-01');

describe('Get participants list who have read the message', () => {
  test('ensure that a client that has seen a future message is considered to have seen all previous messages', () => {
    const messageId = `${startTime.getTime()}`;
    const message = chatMessage(messageId);
    const readReceiptsBySenderId = {
      '12345': { lastReadMessage: `${startTime.getTime() + 1}`, displayName: 'c' }
    };
    const result = [{ id: '12345', displayName: 'c' }];
    expect(getParticipantsWhoHaveReadMessage(message, readReceiptsBySenderId)).toEqual(result);
  });

  test('ensure that a client who has seen a message sent at time x means he/she has seen all messages sent at time x', () => {
    const messageId = `${startTime.getTime()}`;
    const message = chatMessage(messageId);
    const readReceiptsBySenderId = {
      '12345': { lastReadMessage: `${startTime.getTime()}`, displayName: 'c' }
    };
    const result = [{ id: '12345', displayName: 'c' }];
    expect(getParticipantsWhoHaveReadMessage(message, readReceiptsBySenderId)).toEqual(result);
  });

  test('when a client has last seen a message sent at a previous time, the client has not seen the current message', () => {
    const messageId = `${startTime.getTime()}`;
    const message = chatMessage(messageId);
    const readReceiptsBySenderId = {
      '12345': { lastReadMessage: `${startTime.getTime() - 1}`, displayName: 'c' }
    };
    expect(getParticipantsWhoHaveReadMessage(message, readReceiptsBySenderId)).toEqual([]);
  });
});
