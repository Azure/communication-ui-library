// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatHandlers, createDefaultChatHandlersForComponent } from './createHandlers';
import { createStatefulChatClient, StatefulChatClient } from '@internal/chat-stateful-client';
import { ReactElement } from 'react';
import { Common } from '@internal/acs-ui-common';
import { ChatThreadClient } from '@azure/communication-chat';

jest.mock('@internal/chat-stateful-client', () => {
  return {
    createStatefulChatClient: jest.fn().mockReturnValue({
      getChatThreadClient: jest.fn().mockResolvedValue('mockChatThreadClient')
    })
  };
});

jest.mock('@azure/communication-common', () => {
  return {
    AzureCommunicationTokenCredential: jest.fn()
  };
});

jest.mock('@internal/acs-ui-common', () => {
  return {
    fromFlatCommunicationIdentifier: jest.fn().mockImplementation((id: string) => {
      return id;
    })
  };
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TestChatClientComponent(props: ChatHandlers): ReactElement | null {
  return null;
}

describe('createHandlers', () => {
  let mockStatefulChatClient: StatefulChatClient;
  let mockChatThreadClient: ChatThreadClient;
  let handlers: Common<ChatHandlers, ChatHandlers>;

  beforeEach(() => {
    mockStatefulChatClient = createStatefulChatClient({
      userId: { communicationUserId: '1' },
      displayName: 'displayName',
      endpoint: 'endpointUrl',
      credential: new AzureCommunicationTokenCredential('token')
    });
    mockChatThreadClient = mockStatefulChatClient.getChatThreadClient('threadId');
    handlers = createDefaultChatHandlersForComponent(
      mockStatefulChatClient,
      mockChatThreadClient,
      TestChatClientComponent
    );
  });

  test('handlers are created', async () => {
    expect(handlers).toBeDefined();
    expect(handlers.onSendMessage).toBeDefined();
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    expect(handlers.onUploadImage).toBeDefined();
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    expect(handlers.onDeleteImage).toBeDefined();
    expect(handlers.onMessageSeen).toBeDefined();
    expect(handlers.onTyping).toBeDefined();
    expect(handlers.onRemoveParticipant).toBeDefined();
    expect(handlers.updateThreadTopicName).toBeDefined();
    expect(handlers.onLoadPreviousChatMessages).toBeDefined();
    expect(handlers.onUpdateMessage).toBeDefined();
    expect(handlers.onDeleteMessage).toBeDefined();
  });

  test('sendTypingNotification is called when onTyping handler is called', async () => {
    mockChatThreadClient.sendTypingNotification = jest.fn();
    expect(handlers.onTyping).toBeDefined();
    await handlers.onTyping();
    expect(mockChatThreadClient.sendTypingNotification).toHaveBeenCalled();
  });

  test('deleteMessage is called when onDeleteMessage handler is called', async () => {
    mockChatThreadClient.deleteMessage = jest.fn();
    expect(handlers.onDeleteMessage).toBeDefined();
    await handlers.onDeleteMessage('1');
    expect(mockChatThreadClient.deleteMessage).toHaveBeenCalledWith('1');
  });

  test('sendReadReceipt is called when onMessageSeen handler is called', async () => {
    mockChatThreadClient.sendReadReceipt = jest.fn();
    expect(handlers.onMessageSeen).toBeDefined();
    await handlers.onMessageSeen('1');
    expect(mockChatThreadClient.sendReadReceipt).toHaveBeenCalledWith({ chatMessageId: '1' });
  });

  test('updateTopic is called when updateThreadTopicName handler is called', async () => {
    mockChatThreadClient.updateTopic = jest.fn();
    expect(handlers.updateThreadTopicName).toBeDefined();
    await handlers.updateThreadTopicName('New Topic');
    expect(mockChatThreadClient.updateTopic).toHaveBeenCalledWith('New Topic');
  });

  test('removeParticipant is called when onRemoveParticipant handler is called', async () => {
    mockChatThreadClient.removeParticipant = jest.fn();
    expect(handlers.onRemoveParticipant).toBeDefined();
    await handlers.onRemoveParticipant('testid');
    expect(mockChatThreadClient.removeParticipant).toHaveBeenCalledWith('testid');
  });
});
