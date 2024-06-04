// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getMessageState } from './ChatMessageComponentAsEditBoxUtils';
import { MAXIMUM_LENGTH_OF_MESSAGE } from './SendBoxUtils';

describe('ChatMessageComponentAsEditBoxUtils tests', () => {
  test('getMessageState should return `too short` when message is empty', async () => {
    const messageState = getMessageState('', /* @conditional-compile-remove(file-sharing-acs) */ []);
    expect(messageState).toEqual('too short');
  });

  test('getMessageState should return `too short` when message contains only spaces', async () => {
    const messageState = getMessageState('   ', /* @conditional-compile-remove(file-sharing-acs) */ []);
    expect(messageState).toEqual('too short');
  });

  test('getMessageState should return `too long` when message is longer than MAXIMUM_LENGTH_OF_MESSAGE', async () => {
    // generate a message longer than MAXIMUM_LENGTH_OF_MESSAGE
    const message = 'a'.repeat(MAXIMUM_LENGTH_OF_MESSAGE + 1);
    const messageState = getMessageState(message, /* @conditional-compile-remove(file-sharing-acs) */ []);
    expect(messageState).toEqual('too long');
  });

  /* @conditional-compile-remove(file-sharing-acs) */
  test('getMessageState should return `OK` when message is empty but has attachments', async () => {
    const messageState = getMessageState('', [
      {
        id: 'id1',
        name: 'Image1',
        url: 'https://example.com/image1.jpg'
      }
    ]);
    expect(messageState).toEqual('OK');
  });

  test('getMessageState should return `OK` when message is not empty', async () => {
    const messageState = getMessageState('Test message', /* @conditional-compile-remove(file-sharing-acs) */ []);
    expect(messageState).toEqual('OK');
  });
});
