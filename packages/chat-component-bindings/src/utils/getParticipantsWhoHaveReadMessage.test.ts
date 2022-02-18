// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ChatMessageWithStatus } from '@internal/chat-stateful-client';
import { getParticipantsWhoHaveReadMessage } from './getParticipantsWhoHaveReadMessage';

const chatMessage = (messageID: string): ChatMessageWithStatus => ({
  id: messageID,
  type: 'text',
  sequenceId: '89542038450',
  version: 'jehkfhsdf',
  createdOn: new Date(),
  status: 'delivered'
});

const readReceiptForEachSender = {
  '12345': { lastReadMessage: '3', name: 'c' },
  '67890': { lastReadMessage: '5', name: 'd' },
  '11111': { lastReadMessage: '3', name: 'a' },
  '22222': { lastReadMessage: '1', name: 'l' },
  '6748438': { lastReadMessage: '0', name: 'k' }
};

describe('Get participants list who have read the message', () => {
  test('', () => {
    const message = chatMessage('1');
    const result = [
      { id: '11111', name: 'a' },
      { id: '12345', name: 'c' },
      { id: '22222', name: 'l' },
      { id: '67890', name: 'd' }
    ];
    console.log(getParticipantsWhoHaveReadMessage(message, readReceiptForEachSender));
    expect(getParticipantsWhoHaveReadMessage(message, readReceiptForEachSender)).toEqual(result);
  });

  test('', () => {
    const message = chatMessage('0');
    const result = [
      { id: '11111', name: 'a' },
      { id: '12345', name: 'c' },
      { id: '22222', name: 'l' },
      { id: '67890', name: 'd' },
      { id: '6748438', name: 'k' }
    ];
    expect(getParticipantsWhoHaveReadMessage(message, readReceiptForEachSender)).toEqual(result);
  });

  test('', () => {
    const message = chatMessage('9');
    const result = [];
    expect(getParticipantsWhoHaveReadMessage(message, readReceiptForEachSender)).toEqual(result);
  });

  test('', () => {
    const message = chatMessage('3');
    const result = [
      { id: '11111', name: 'a' },
      { id: '12345', name: 'c' },
      { id: '67890', name: 'd' }
    ];
    expect(getParticipantsWhoHaveReadMessage(message, readReceiptForEachSender)).toEqual(result);
  });

  test('', () => {
    const message = chatMessage('2');
    const result = [
      { id: '11111', name: 'a' },
      { id: '12345', name: 'c' },
      { id: '67890', name: 'd' }
    ];
    expect(getParticipantsWhoHaveReadMessage(message, readReceiptForEachSender)).toEqual(result);
  });
});
