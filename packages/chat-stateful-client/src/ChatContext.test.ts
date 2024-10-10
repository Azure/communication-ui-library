// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ChatContext } from './ChatContext';
import { messageTemplateWithResourceCache } from './TestHelpers';
import { MockCommunicationUserCredential } from './mocks/MockCommunicationUserCredential';

describe('ChatContext api functions', () => {
  let context: ChatContext;
  const threadId = 'threadId';
  const messageId = 'messageId1';

  beforeEach(() => {
    context = new ChatContext(0, new MockCommunicationUserCredential());
  });
  test('dispose method clears the message resourceCache', () => {
    context.createThreadIfNotExist(threadId);
    context.setChatMessages(threadId, { messageId1: messageTemplateWithResourceCache });
    expect(context.getState().threads[threadId]?.chatMessages[messageId]).toBeDefined();
    Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: jest.fn() });

    const mockRevokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockImplementation();
    context.dispose();

    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2);
    expect(context.getState().threads[threadId]?.chatMessages[messageId]).toBeDefined();
    expect(context.getState().threads[threadId]?.chatMessages[messageId]?.resourceCache).toBeUndefined();
  });
  test('removeResourceFromCache method should remove a specific item from resourceCache', () => {
    const resourceUrl = 'resource2Url';
    const expectedResourceCache = { resource1Url: { sourceUrl: 'blob:resource1' } };
    context.createThreadIfNotExist(threadId);
    context.setChatMessages(threadId, { messageId1: messageTemplateWithResourceCache });
    expect(context.getState().threads[threadId]?.chatMessages[messageId]).toBeDefined();
    Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: jest.fn() });

    const mockRevokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockImplementation();
    context.removeResourceFromCache(threadId, messageId, resourceUrl);

    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
    expect(context.getState().threads[threadId]?.chatMessages[messageId]?.resourceCache).toEqual(expectedResourceCache);
  });
});
