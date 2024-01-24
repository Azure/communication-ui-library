// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationTokenCredential } from '@azure/communication-common';
import { ChatContext } from './ChatContext';
import { ResourceDownloadError, ResourceDownloadQueue } from './ResourceDownloadQueue';
import { messageTemplate } from './mocks/createMockChatThreadClient';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';

jest.mock('@azure/communication-chat');

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
  test('should add a message to the queue and contains message', () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const mockMessage = messageTemplate;
    const queue = new ResourceDownloadQueue(context, tokenCredential);
    queue.addMessage(mockMessage);
    expect(queue.containsMessage(mockMessage)).toBe(true);
  });

  test('start queue should call operation', async () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const mockMessage = messageTemplate;
    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    queue.addMessage(mockMessage);
    await queue.startQueue('threadId', operation);
    expect(operation).toHaveBeenCalled();
  });

  test('adding multiple chats to queue should call operation multiple times', async () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const first = messageTemplate;
    first.id = 'first';
    const second = messageTemplate;
    second.id = 'second';
    const third = messageTemplate;
    third.id = 'third';

    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    queue.addMessage(first);
    queue.addMessage(second);
    queue.addMessage(third);
    await queue.startQueue('threadId', operation);
    expect(operation).toHaveBeenCalledTimes(3);
  });

  test('adding multiple chat to queue should call operation in order', async () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const first = { ...messageTemplate };
    first.id = 'first';
    const second = { ...messageTemplate };
    second.id = 'second';
    const third = { ...messageTemplate };
    third.id = 'third';

    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    queue.addMessage(first);
    queue.addMessage(second);
    queue.addMessage(third);
    await queue.startQueue('threadId', operation);

    expect((operation.mock.calls[0][0] as ChatMessageWithStatus).id).toBe(first.id);
    expect((operation.mock.calls[1][0] as ChatMessageWithStatus).id).toBe(second.id);
    expect((operation.mock.calls[2][0] as ChatMessageWithStatus).id).toBe(third.id);
  });

  test('if one operation fails, retry attempt should be made', async () => {
    const context = new ChatContext();
    const tokenCredential = stubCommunicationTokenCredential();
    const first = { ...messageTemplate };
    first.id = 'first';
    const second = { ...messageTemplate };
    second.id = 'second';
    const third = { ...messageTemplate };
    third.id = 'third';

    const queue = new ResourceDownloadQueue(context, tokenCredential);
    const operation = jest.fn();
    const e = new ResourceDownloadError(first);
    operation.mockRejectedValueOnce(e);
    queue.addMessage(first);
    queue.addMessage(second);
    queue.addMessage(third);
    await queue.startQueue('threadId', operation);
    expect(operation).toHaveBeenCalledTimes(4);
  });
});
