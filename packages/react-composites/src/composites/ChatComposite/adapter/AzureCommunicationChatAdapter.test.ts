// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createAzureCommunicationChatAdapter } from './AzureCommunicationChatAdapter';
import { StubChatClient } from './StubChatClient';

jest.useFakeTimers();

// FIXME: Use dependency injection once stateful chat client exposes a constructor that takes a chat client.
jest.mock('@azure/communication-chat', () => {
  return {
    ...jest.requireActual('@azure/communication-chat'),
    ChatClient: jest.fn().mockImplementation(() => {
      return new StubChatClient();
    })
  };
});

describe('xkcd: Creation of a new AzureCommunicationChatAdapter with stub client', () => {
  it('does not throw', () => {
    createAzureCommunicationChatAdapter(
      { communicationUserId: 'stubUserId' },
      'stubToken',
      'stubEndointUrl',
      'stubThreadId',
      'stubDisplayName'
    );
  });
});
