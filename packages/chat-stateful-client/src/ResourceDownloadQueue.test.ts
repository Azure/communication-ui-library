// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatAttachmentType } from '@azure/communication-chat';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { CommunicationTokenCredential } from '@azure/communication-common';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatContext } from './ChatContext';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ResourceDownloadError, ResourceDownloadQueue } from './ResourceDownloadQueue';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { messageTemplate } from './mocks/createMockChatThreadClient';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { resolve } from 'path';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
jest.mock('@azure/communication-chat');
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * @private
 */
export const stubCommunicationTokenCredential = (): CommunicationTokenCredential => {
  return {
    getToken: (): Promise<{ token: string; expiresOnTimestamp: number }> => {
      throw new Error('Not implemented');
    },
    dispose: (): void => {
      /* Nothing to dispose */
    }
  };
};

describe('ResourceDownloadQueue api functions', () => {
  test('Placeholder test. Please remove this when stabilizing teams-inline-images-and-file-sharing', () => {});
});

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
describe('ResourceDownloadQueue api functions', () => {
  test('should add a message to the queue and contains message', () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const mockMessage = { ...messageTemplate };
    const firstAttachments = [
      { id: '1', attachmentType: 'image' as ChatAttachmentType, name: 'image1', url: 'url1', previewUrl: 'previewUrl1' }
    ];
    mockMessage.content = { message: 'new message', attachments: firstAttachments };
    const queue = new ResourceDownloadQueue(context, tokenCredential);
    queue.addMessage(mockMessage);
    expect(queue.containsMessageWithSameAttachments(mockMessage)).toBe(true);
  });

  test('should add a message to queue and the same message with edited content', () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const firstAttachments = [
      { id: '1', attachmentType: 'image' as ChatAttachmentType, name: 'image1', url: 'url1', previewUrl: 'previewUrl1' }
    ];
    const secondAttachments = [
      { id: '2', attachmentType: 'image' as ChatAttachmentType, name: 'image2', url: 'url2', previewUrl: 'previewUrl2' }
    ];
    const originalMessage = { ...messageTemplate };
    originalMessage.content = { message: 'new message', attachments: firstAttachments };
    const editedMessage = { ...originalMessage };
    editedMessage.content = { message: 'edited message', attachments: secondAttachments };

    const queue = new ResourceDownloadQueue(context, tokenCredential);
    queue.addMessage(originalMessage);
    expect(queue.containsMessageWithSameAttachments(originalMessage)).toBe(true);
    expect(queue.containsMessageWithSameAttachments(editedMessage)).toBe(false);
    queue.addMessage(editedMessage);
    expect(queue.containsMessageWithSameAttachments(editedMessage)).toBe(true);
  });

  test('start queue should call operation', async () => {
    const tokenCredential = stubCommunicationTokenCredential();
    const context = new ChatContext(0, tokenCredential);
    const mockMessage = { ...messageTemplate };
    const mockAttachments = [
      { id: '1', attachmentType: 'image' as ChatAttachmentType, name: 'image1', url: 'url1', previewUrl: 'previewUrl1' }
    ];
    mockMessage.content = { message: 'new message', attachments: mockAttachments };
    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    queue.addMessage(mockMessage);
    await queue.startQueue('threadId', operation);
    expect(operation).toHaveBeenCalled();
  });

  test('adding multiple chats to queue should call operation multiple times', async () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const first = { ...messageTemplate };
    first.id = 'first';
    const firstAttachments = [
      { id: '1', attachmentType: 'image' as ChatAttachmentType, name: 'image1', url: 'url1', previewUrl: 'previewUrl1' }
    ];
    first.content = { message: 'new message', attachments: firstAttachments };
    const second = { ...messageTemplate };
    second.id = 'second';
    const secondAttachments = [
      { id: '2', attachmentType: 'image' as ChatAttachmentType, name: 'image2', url: 'url2', previewUrl: 'previewUrl2' }
    ];
    second.content = { message: 'new message', attachments: secondAttachments };
    const third = { ...messageTemplate };
    third.id = 'third';
    const thirdAttachments = [
      { id: '3', attachmentType: 'image' as ChatAttachmentType, name: 'image3', url: 'url3', previewUrl: 'previewUrl3' }
    ];
    third.content = { message: 'new message', attachments: thirdAttachments };

    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    queue.addMessage(first);
    queue.addMessage(second);
    queue.addMessage(third);
    await queue.startQueue('threadId', operation);
    expect(operation).toHaveBeenCalledTimes(3);
  });

  test('multiple chats in queue should call only one operation at a time', (done) => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const first = { ...messageTemplate };
    first.id = 'first';
    const firstAttachments = [
      { id: '1', attachmentType: 'image' as ChatAttachmentType, name: 'image1', url: 'url1', previewUrl: 'previewUrl1' }
    ];
    first.content = { message: 'new message', attachments: firstAttachments };
    const second = { ...messageTemplate };
    second.id = 'second';
    const secondAttachments = [
      { id: '2', attachmentType: 'image' as ChatAttachmentType, name: 'image2', url: 'url2', previewUrl: 'previewUrl2' }
    ];
    second.content = { message: 'new message', attachments: secondAttachments };
    const third = { ...messageTemplate };
    third.id = 'third';
    const thirdAttachments = [
      { id: '3', attachmentType: 'image' as ChatAttachmentType, name: 'image3', url: 'url3', previewUrl: 'previewUrl3' }
    ];
    third.content = { message: 'new message', attachments: thirdAttachments };

    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    const query: string[] = [];
    const expected = ['previewUrl1', 'previewUrl2', 'previewUrl3'];
    operation.mockImplementation(async (url: string) => {
      query.push(url);
      if (query.length === 3) {
        expect(query).toEqual(expected);
        done();
      }
      resolve();
    });

    queue.addMessage(first);
    queue.startQueue('threadId', operation);
    queue.addMessage(second);
    queue.addMessage(third);
  });

  test('adding multiple chat to queue should call operation in order', async () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const first = { ...messageTemplate };
    first.id = 'first';
    const firstAttachments = [
      { id: '1', attachmentType: 'image' as ChatAttachmentType, name: 'image1', url: 'url1', previewUrl: 'previewUrl1' }
    ];
    first.content = { message: 'new message', attachments: firstAttachments };
    const second = { ...messageTemplate };
    second.id = 'second';
    const secondAttachments = [
      { id: '2', attachmentType: 'image' as ChatAttachmentType, name: 'image2', url: 'url2', previewUrl: 'previewUrl2' }
    ];
    second.content = { message: 'new message', attachments: secondAttachments };
    const third = { ...messageTemplate };
    third.id = 'third';
    const thirdAttachments = [
      { id: '3', attachmentType: 'image' as ChatAttachmentType, name: 'image3', url: 'url3', previewUrl: 'previewUrl3' }
    ];
    third.content = { message: 'new message', attachments: thirdAttachments };

    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    queue.addMessage(first);
    queue.addMessage(second);
    queue.addMessage(third);
    await queue.startQueue('threadId', operation);

    expect(operation.mock.calls[0][0] as string).toBe('previewUrl1');
    expect(operation.mock.calls[1][0] as string).toBe('previewUrl2');
    expect(operation.mock.calls[2][0] as string).toBe('previewUrl3');
  });

  test('if first operation fails, the rest should still be made', async () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const first = { ...messageTemplate };
    first.id = 'first';
    const firstAttachments = [
      { id: '1', attachmentType: 'image' as ChatAttachmentType, name: 'image1', url: 'url1', previewUrl: 'previewUrl1' }
    ];
    first.content = { message: 'new message', attachments: firstAttachments };
    const second = { ...messageTemplate };
    second.id = 'second';
    const secondAttachments = [
      { id: '2', attachmentType: 'image' as ChatAttachmentType, name: 'image2', url: 'url2', previewUrl: 'previewUrl2' }
    ];
    second.content = { message: 'new message', attachments: secondAttachments };
    const third = { ...messageTemplate };
    third.id = 'third';
    const thirdAttachments = [
      { id: '3', attachmentType: 'image' as ChatAttachmentType, name: 'image3', url: 'url3', previewUrl: 'previewUrl3' }
    ];
    third.content = { message: 'new message', attachments: thirdAttachments };

    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    const e = new ResourceDownloadError(first);
    operation.mockRejectedValueOnce(e);
    queue.addMessage(first);
    queue.addMessage(second);
    queue.addMessage(third);
    await queue.startQueue('threadId', operation);
    expect(operation).toHaveBeenCalledTimes(3);
  });

  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  test('startQueue method should update the resourceCache', async () => {
    const threadId = 'threadId';
    const messageId = 'messageId';
    const context = new ChatContext();
    context.createThreadIfNotExist(threadId);
    context.setChatMessages(threadId, { messageId1: messageTemplate });
    const tokenCredential = stubCommunicationTokenCredential();

    const first = { ...messageTemplate };
    first.id = messageId;
    const firstAttachments = [
      { id: '1', attachmentType: 'image' as ChatAttachmentType, name: 'image1', url: 'url1', previewUrl: 'previewUrl1' }
    ];
    first.content = { message: 'new message', attachments: firstAttachments };

    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    queue.addMessage(first);
    await queue.startQueue(threadId, operation);
    expect(operation).toHaveBeenCalledTimes(1);
    const resourceCache = context.getState().threads[threadId].chatMessages[messageId].resourceCache;
    expect(resourceCache).toBeDefined();
  });
});
