// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { CommunicationTokenCredential } from '@azure/communication-common';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatContext } from './ChatContext';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ResourceDownloadError, ResourceDownloadQueue } from './ResourceDownloadQueue';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { messageTemplate } from './mocks/createMockChatThreadClient';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
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
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
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

  test('multiple chats in queue should call only one operation at a time', (done) => {
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
    const query: string[] = [];
    const expected = ['first', 'second', 'third'];
    operation.mockImplementation(async (message: ChatMessageWithStatus) => {
      query.push(message.id);
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
