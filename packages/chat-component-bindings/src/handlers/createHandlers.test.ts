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
      getState: jest.fn().mockReturnValue({
        displayName: 'displayName'
      }),
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
  const displayName = 'displayName';

  beforeEach(() => {
    mockStatefulChatClient = createStatefulChatClient({
      userId: { communicationUserId: '1' },
      displayName: displayName,
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

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  test('uploadImage is called when onUploadImage handler is called', async () => {
    {
      mockChatThreadClient.uploadImage = jest.fn().mockResolvedValue('mockUploadImageResult');
      expect(handlers.onUploadImage).toBeDefined();
      const blob = new Blob();
      const result = await handlers.onUploadImage(blob, 'testImageFilename');
      expect(mockChatThreadClient.uploadImage).toHaveBeenCalledWith(blob, 'testImageFilename');
      expect(result).toBe('mockUploadImageResult');
    }
  });

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  test('deleteImage is called when onDeleteImage handler is called', async () => {
    mockChatThreadClient.deleteImage = jest.fn();
    expect(handlers.onDeleteImage).toBeDefined();
    await handlers.onDeleteImage('imageId');
    expect(mockChatThreadClient.deleteImage).toHaveBeenCalledWith('imageId');
  });

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  test('logs error when deleteImage fails', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorText = 'Failed to delete image';
    mockChatThreadClient.deleteImage = jest.fn().mockRejectedValue(new Error(errorText));
    expect(handlers.onDeleteImage).toBeDefined();
    await handlers.onDeleteImage('imageId');
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting image message: Error: ' + errorText);
    consoleSpy.mockRestore();
  });

  test('updateMessage is called when onUpdateMessage handler is called', async () => {
    mockChatThreadClient.updateMessage = jest.fn();
    expect(handlers.onUpdateMessage).toBeDefined();
    await handlers.onUpdateMessage('1', 'new content');
    expect(mockChatThreadClient.updateMessage).toHaveBeenCalledWith('1', {
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      attachments: undefined,
      content: 'new content',
      /* @conditional-compile-remove(file-sharing-acs) */
      metadata: {
        fileSharingMetadata: undefined
      }
    });
  });

  /* @conditional-compile-remove(file-sharing-acs) */
  test('updateMessage is called with metadata when onUpdateMessage handler is called with options', async () => {
    mockChatThreadClient.updateMessage = jest.fn();
    expect(handlers.onUpdateMessage).toBeDefined();
    const options = {
      metadata: { key: 'value' },
      attachments: [{ id: 'attachment1', name: 'test-name.pdf', url: 'testURL' }]
    };
    await handlers.onUpdateMessage('1', 'new content', options);
    expect(mockChatThreadClient.updateMessage).toHaveBeenCalledWith('1', {
      content: 'new content',
      metadata: {
        key: 'value',
        fileSharingMetadata: JSON.stringify(options.attachments)
      }
    });
  });

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  test('updateMessage is called with image attachments when onUpdateMessage handler is called', async () => {
    mockChatThreadClient.updateMessage = jest.fn();
    expect(handlers.onUpdateMessage).toBeDefined();
    const content = '<img src="image123.png" id="image1"/>';
    await handlers.onUpdateMessage('1', content);
    expect(mockChatThreadClient.updateMessage).toHaveBeenCalledWith('1', {
      content,
      attachments: [
        {
          id: 'image1',
          attachmentType: 'image'
        }
      ],
      /* @conditional-compile-remove(file-sharing-acs) */
      metadata: {
        fileSharingMetadata: undefined
      }
    });
  });

  /* @conditional-compile-remove(file-sharing-acs) */
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  test('updateMessage is called with metadata and image attachments when onUpdateMessage handler is called with options', async () => {
    mockChatThreadClient.updateMessage = jest.fn();
    expect(handlers.onUpdateMessage).toBeDefined();
    const content = '<img src="image123.png" id="image1"/>';
    const options = {
      metadata: { key: 'value' },
      attachments: [{ id: 'attachment1', name: 'testFile1.pdf', url: 'newTestURL' }]
    };
    await handlers.onUpdateMessage('1', content, options);
    expect(mockChatThreadClient.updateMessage).toHaveBeenCalledWith('1', {
      content,
      metadata: {
        key: 'value',
        fileSharingMetadata: JSON.stringify(options.attachments)
      },
      attachments: [{ id: 'image1', attachmentType: 'image' }]
    });
  });

  test('sendMessage is called when onSendMessage handler is called', async () => {
    mockChatThreadClient.sendMessage = jest.fn();
    expect(handlers.onSendMessage).toBeDefined();
    await handlers.onSendMessage('test message');
    expect(mockChatThreadClient.sendMessage).toHaveBeenCalledWith(
      {
        content: 'test message',
        senderDisplayName: displayName
      },
      undefined
    );
  });

  /* @conditional-compile-remove(file-sharing-acs) */
  test('sendMessage is called with attachments when onSendMessage handler is called with options', async () => {
    mockChatThreadClient.sendMessage = jest.fn();
    expect(handlers.onSendMessage).toBeDefined();
    const options = {
      metadata: { key: 'value' },
      attachments: [{ id: 'attachment1', name: 'testFile1.pdf', url: 'testURL' }]
    };
    await handlers.onSendMessage('test message', options);
    expect(mockChatThreadClient.sendMessage).toHaveBeenCalledWith(
      {
        content: 'test message',
        senderDisplayName: displayName
      },
      {
        metadata: {
          key: 'value',
          fileSharingMetadata: JSON.stringify(options.attachments)
        },
        attachments: undefined,
        type: undefined
      }
    );
  });

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  test('sendMessage is called with image attachments when onSendMessage handler is called', async () => {
    mockChatThreadClient.sendMessage = jest.fn();
    expect(handlers.onSendMessage).toBeDefined();
    const content = '<img src="image123.png" id="image1"/>';
    await handlers.onSendMessage(content);
    expect(mockChatThreadClient.sendMessage).toHaveBeenCalledWith(
      {
        content,
        senderDisplayName: displayName
      },
      {
        attachments: [
          {
            id: 'image1',
            attachmentType: 'image'
          }
        ],
        metadata: {
          fileSharingMetadata: undefined
        },
        type: undefined
      }
    );
  });

  /* @conditional-compile-remove(file-sharing-acs) */
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  test('sendMessage is called with metadata and image attachments when onSendMessage handler is called with options', async () => {
    mockChatThreadClient.sendMessage = jest.fn();
    expect(handlers.onSendMessage).toBeDefined();
    const content = '<img src="image123.png" id="image1"/>';
    const options = {
      metadata: { key: 'value' },
      attachments: [{ id: 'attachment1', name: 'testFile1.pdf', url: 'newTestURL' }]
    };
    await handlers.onSendMessage(content, options);
    expect(mockChatThreadClient.sendMessage).toHaveBeenCalledWith(
      {
        content,
        senderDisplayName: displayName
      },
      {
        metadata: {
          key: 'value',
          fileSharingMetadata: JSON.stringify(options.attachments)
        },
        attachments: [{ id: 'image1', attachmentType: 'image' }],
        type: undefined
      }
    );
  });

  test('onLoadPreviousChatMessages returns true when all messages are loaded', async () => {
    const mockMessageIterator = {
      next: jest
        .fn()
        .mockResolvedValueOnce({ value: { id: '1', type: 'text' }, done: false })
        .mockResolvedValueOnce({ value: { id: '2', type: 'text' }, done: true })
    };
    const mockReadReceiptIterator = {
      next: jest.fn().mockResolvedValue({ value: { chatMessageId: '1' }, done: true })
    };

    mockChatThreadClient.listMessages = jest.fn().mockReturnValue(mockMessageIterator);
    mockChatThreadClient.listReadReceipts = jest.fn().mockReturnValue(mockReadReceiptIterator);

    const result = await handlers.onLoadPreviousChatMessages(2);
    expect(result).toBe(true);
    expect(mockMessageIterator.next).toHaveBeenCalledTimes(2);
    expect(mockReadReceiptIterator.next).toHaveBeenCalledTimes(1);
  });

  test('onLoadPreviousChatMessages returns false when not all messages are loaded', async () => {
    const mockMessageIterator = {
      next: jest
        .fn()
        .mockResolvedValueOnce({ value: { id: '1', type: 'text' }, done: false })
        .mockResolvedValueOnce({ value: { id: '2', type: 'text' }, done: false })
    };
    const mockReadReceiptIterator = {
      next: jest.fn().mockResolvedValue({ value: { chatMessageId: '1' }, done: true })
    };

    mockChatThreadClient.listMessages = jest.fn().mockReturnValue(mockMessageIterator);
    mockChatThreadClient.listReadReceipts = jest.fn().mockReturnValue(mockReadReceiptIterator);

    const result = await handlers.onLoadPreviousChatMessages(2);
    expect(result).toBe(false);
    expect(mockMessageIterator.next).toHaveBeenCalledTimes(2);
    expect(mockReadReceiptIterator.next).toHaveBeenCalledTimes(1);
  });

  test('onLoadPreviousChatMessages initializes iterators lazily', async () => {
    const mockMessageIterator = {
      next: jest
        .fn()
        .mockResolvedValueOnce({ value: { id: '1', type: 'text' }, done: false })
        .mockResolvedValueOnce({ value: { id: '2', type: 'text' }, done: false })
    };
    const mockReadReceiptIterator = {
      next: jest
        .fn()
        .mockResolvedValueOnce({ value: { chatMessageId: '2' }, done: false })
        .mockResolvedValueOnce({ value: { chatMessageId: '1' }, done: true })
        .mockResolvedValueOnce({ value: { chatMessageId: '1' }, done: true })
    };

    mockChatThreadClient.listMessages = jest.fn().mockReturnValue(mockMessageIterator);
    mockChatThreadClient.listReadReceipts = jest.fn().mockReturnValue(mockReadReceiptIterator);

    await handlers.onLoadPreviousChatMessages(1);
    // calling again to ensure that the iterators are not re-initialized
    await handlers.onLoadPreviousChatMessages(1);
    expect(mockChatThreadClient.listMessages).toHaveBeenCalledTimes(1);
    expect(mockChatThreadClient.listMessages).toHaveBeenCalledWith({ maxPageSize: 50 });
    expect(mockChatThreadClient.listReadReceipts).toHaveBeenCalledTimes(1);
  });

  test('onLoadPreviousChatMessages fetches read receipts until time is less than earliest message time', async () => {
    const mockMessageIterator = {
      next: jest
        .fn()
        .mockResolvedValueOnce({ value: { id: '1', type: 'text' }, done: false })
        .mockResolvedValueOnce({ value: { id: '2', type: 'text' }, done: false })
        .mockResolvedValueOnce({ value: { id: '3', type: 'text' }, done: true })
    };
    const mockReadReceiptIterator = {
      next: jest
        .fn()
        .mockResolvedValueOnce({ value: { chatMessageId: '3' }, done: false })
        .mockResolvedValueOnce({ value: { chatMessageId: '2' }, done: false })
        .mockResolvedValueOnce({ value: { chatMessageId: '1' }, done: true })
    };

    mockChatThreadClient.listMessages = jest.fn().mockReturnValue(mockMessageIterator);
    mockChatThreadClient.listReadReceipts = jest.fn().mockReturnValue(mockReadReceiptIterator);

    await handlers.onLoadPreviousChatMessages(2);
    expect(mockReadReceiptIterator.next).toHaveBeenCalledTimes(3);
  });
});
