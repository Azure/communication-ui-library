// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ChatAttachment } from '@azure/communication-chat';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { ChatContext } from './ChatContext';
import { ResourceDownloadQueue, fetchImageSource } from './ResourceDownloadQueue';
import { messageTemplate } from './mocks/createMockChatThreadClient';
import { resolve } from 'path';
jest.mock('@azure/communication-chat');
/**
 * @private
 */
export const stubCommunicationTokenCredential = (): CommunicationTokenCredential => {
  return {
    getToken: (): Promise<{ token: string; expiresOnTimestamp: number }> => {
      return Promise.resolve({ token: 'token', expiresOnTimestamp: 1 });
    },
    dispose: (): void => {
      /* Nothing to dispose */
    }
  };
};

describe('ResourceDownloadQueue api functions', () => {
  // URL.createObjectURL is not available in jest-dom
  // so we need to mock it in tests
  if (typeof URL.createObjectURL === 'undefined') {
    Object.defineProperty(window.URL, 'createObjectURL', {
      value: () => {
        return 'http://mocked-url';
      }
    });
  }

  const createResourceDownloadQueue = (
    context: ChatContext,
    tokenCredential: CommunicationTokenCredential
  ): ResourceDownloadQueue => {
    return new ResourceDownloadQueue(context, { credential: tokenCredential, endpoint: 'endpoint' });
  };

  const createMockAttachment = (id: string, url: string, previewUrl: string): ChatAttachment => {
    return {
      id: id,
      attachmentType: 'image',
      name: 'image1',
      url: url,
      previewUrl: previewUrl
    };
  };

  test('should add a message to the queue and contains message', () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const mockMessage = { ...messageTemplate };
    const firstAttachments = [createMockAttachment('1', 'url1', 'previewUrl1')];
    mockMessage.content = { message: 'new message', attachments: firstAttachments };
    const queue = createResourceDownloadQueue(context, tokenCredential);
    queue.addMessage(mockMessage);
    expect(queue.containsMessageWithSameAttachments(mockMessage)).toBe(true);
  });

  test('should add a message to queue and the same message with edited content', () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const firstAttachments = [createMockAttachment('1', 'url1', 'previewUrl1')];
    const secondAttachments = [createMockAttachment('2', 'url2', 'previewUrl2')];
    const originalMessage = { ...messageTemplate };
    originalMessage.content = { message: 'new message', attachments: firstAttachments };
    const editedMessage = { ...originalMessage };
    editedMessage.content = { message: 'edited message', attachments: secondAttachments };

    const queue = createResourceDownloadQueue(context, tokenCredential);
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
    const mockAttachments = [createMockAttachment('1', 'url1', 'previewUrl1')];
    mockMessage.content = { message: 'new message', attachments: mockAttachments };
    const queue = createResourceDownloadQueue(context, tokenCredential);
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
    const firstAttachments = [createMockAttachment('1', 'url1', 'previewUrl1')];
    first.content = { message: 'new message', attachments: firstAttachments };
    const second = { ...messageTemplate };
    second.id = 'second';
    const secondAttachments = [createMockAttachment('2', 'url2', 'previewUrl2')];
    second.content = { message: 'new message', attachments: secondAttachments };
    const third = { ...messageTemplate };
    third.id = 'third';
    const thirdAttachments = [createMockAttachment('3', 'url3', 'previewUrl3')];
    third.content = { message: 'new message', attachments: thirdAttachments };

    const queue = createResourceDownloadQueue(context, tokenCredential);
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
    const firstAttachments = [createMockAttachment('1', 'url1', 'previewUrl1')];
    first.content = { message: 'new message', attachments: firstAttachments };
    const second = { ...messageTemplate };
    second.id = 'second';
    const secondAttachments = [createMockAttachment('2', 'url2', 'previewUrl2')];
    second.content = { message: 'new message', attachments: secondAttachments };
    const third = { ...messageTemplate };
    third.id = 'third';
    const thirdAttachments = [createMockAttachment('3', 'url3', 'previewUrl3')];
    third.content = { message: 'new message', attachments: thirdAttachments };

    const queue = createResourceDownloadQueue(context, tokenCredential);
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
    const firstAttachments = [createMockAttachment('1', 'url1', 'previewUrl1')];
    first.content = { message: 'new message', attachments: firstAttachments };
    const second = { ...messageTemplate };
    second.id = 'second';
    const secondAttachments = [createMockAttachment('2', 'url2', 'previewUrl2')];
    second.content = { message: 'new message', attachments: secondAttachments };
    const third = { ...messageTemplate };
    third.id = 'third';
    const thirdAttachments = [createMockAttachment('3', 'url3', 'previewUrl3')];
    third.content = { message: 'new message', attachments: thirdAttachments };

    const queue = createResourceDownloadQueue(context, tokenCredential);
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
    const firstAttachments = [createMockAttachment('1', 'url1', 'previewUrl1')];
    first.content = { message: 'new message', attachments: firstAttachments };
    const second = { ...messageTemplate };
    second.id = 'second';
    const secondAttachments = [createMockAttachment('2', 'url2', 'previewUrl2')];
    second.content = { message: 'new message', attachments: secondAttachments };
    const third = { ...messageTemplate };
    third.id = 'third';
    const thirdAttachments = [createMockAttachment('3', 'url3', 'previewUrl3')];
    third.content = { message: 'new message', attachments: thirdAttachments };

    const queue = createResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    operation.mockRejectedValueOnce(new Error('mock error'));
    queue.addMessage(first);
    queue.addMessage(second);
    queue.addMessage(third);
    await queue.startQueue('threadId', operation);
    expect(operation).toHaveBeenCalledTimes(3);
  });

  test('startQueue method should update the resourceCache', async () => {
    const threadId = 'threadId';
    const messageId = 'messageId';
    const context = new ChatContext();
    context.createThreadIfNotExist(threadId);
    context.setChatMessages(threadId, { messageId1: messageTemplate });
    const tokenCredential = stubCommunicationTokenCredential();

    const first = { ...messageTemplate };
    first.id = messageId;
    const firstAttachments = [createMockAttachment('1', 'url1', 'previewUrl1')];
    first.content = { message: 'new message', attachments: firstAttachments };

    const queue = createResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    queue.addMessage(first);
    await queue.startQueue(threadId, operation);
    expect(operation).toHaveBeenCalledTimes(1);
    const resourceCache = context.getState().threads[threadId].chatMessages[messageId].resourceCache;
    expect(resourceCache).toBeDefined();
  });
  test('if operation fails, error should be in the cache', async () => {
    const threadId = 'threadId';
    const messageId = 'messageId';
    const context = new ChatContext();
    context.createThreadIfNotExist(threadId);
    context.setChatMessages(threadId, { messageId1: messageTemplate });
    const tokenCredential = stubCommunicationTokenCredential();

    const first = { ...messageTemplate };
    first.id = messageId;
    const firstAttachments = [createMockAttachment('1', 'url1', 'previewUrl1')];
    first.content = { message: 'new message', attachments: firstAttachments };

    const queue = createResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    operation.mockRejectedValueOnce(new Error('error'));
    queue.addMessage(first);
    await queue.startQueue(threadId, operation);
    expect(operation).toHaveBeenCalledTimes(1);
    const resourceCache = context.getState().threads[threadId].chatMessages[messageId].resourceCache;
    expect(resourceCache).toBeDefined();
    expect(resourceCache?.['previewUrl1'].error).toBeDefined();
    expect(resourceCache?.['previewUrl1'].sourceUrl).toEqual('');
  });
  test('if operation fails for first item, error should be in the cache only for first item', async () => {
    const threadId = 'threadId';
    const messageId = 'messageId';
    const context = new ChatContext();
    context.createThreadIfNotExist(threadId);
    context.setChatMessages(threadId, { messageId1: messageTemplate });
    const tokenCredential = stubCommunicationTokenCredential();

    const first = { ...messageTemplate };
    first.id = messageId;
    const firstAttachments = [
      createMockAttachment('1', 'url1', 'previewUrl1'),
      createMockAttachment('2', 'url2', 'previewUrl2'),
      createMockAttachment('3', 'url3', 'previewUrl3')
    ];
    first.content = { message: 'new message', attachments: firstAttachments };

    const queue = createResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    operation.mockRejectedValueOnce(new Error('error'));
    queue.addMessage(first);
    await queue.startQueue(threadId, operation);
    expect(operation).toHaveBeenCalledTimes(3);
    const resourceCache = context.getState().threads[threadId].chatMessages[messageId].resourceCache;
    expect(resourceCache).toBeDefined();
    expect(resourceCache?.['previewUrl1'].error).toBeDefined();
    expect(resourceCache?.['previewUrl1'].sourceUrl).toEqual('');
    expect(resourceCache?.['previewUrl2'].error).toBeUndefined();
    expect(resourceCache?.['previewUrl3'].error).toBeUndefined();
  });
});

describe('fetchImageSource functionality', () => {
  test('if fetchImageSource times out error should be thrown', async () => {
    const abortController = new AbortController();
    let abortCalled = false;

    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            blob() {}
          } as Response);
        }, 100);
      });
    });

    jest.spyOn(AbortController.prototype, 'abort').mockImplementation(() => {
      abortCalled = true;
    });

    await fetchImageSource(
      'https://url',
      { credential: stubCommunicationTokenCredential(), endpoint: 'https://endpoint' },
      { timeout: 10, abortController }
    );
    expect(abortCalled).toBe(true);
  });
});
