// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatContext } from './ChatContext';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { messageTemplateWithResourceCache } from './TestHelpers';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { MockCommunicationUserCredential } from './mocks/MockCommunicationUserCredential';

describe('ChatContext api functions', () => {
  test('Placeholder test. Please remove this when stabilizing teams-inline-images-and-file-sharing', () => {});
});

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
describe('ChatContext api functions', () => {
  let context: ChatContext;
  const threadId = 'threadId';
  const messageId = 'messageId1';

  beforeEach(() => {
    context = new ChatContext(0, new MockCommunicationUserCredential());
  });
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  test('dispose method clears the message resourceCache', () => {
    context.createThreadIfNotExist(threadId);
    context.setChatMessages(threadId, { messageId1: messageTemplateWithResourceCache });
    expect(context.getState().threads[threadId].chatMessages[messageId]).toBeDefined();
    Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: jest.fn() });

    const mockRevokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockImplementation();
    context.dispose();

    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2);
    expect(context.getState().threads[threadId].chatMessages[messageId].resourceCache).toBeUndefined();
  });
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  test('removeResourceFromCache method should remove a specific item from resourceCache', () => {
    const resourceUrl = 'resource2Url';
    const expectedResourceCache = { resource1Url: 'blob:resource1' };
    context.createThreadIfNotExist(threadId);
    context.setChatMessages(threadId, { messageId1: messageTemplateWithResourceCache });
    expect(context.getState().threads[threadId].chatMessages[messageId]).toBeDefined();
    Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: jest.fn() });

    const mockRevokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockImplementation();
    context.removeResourceFromCache(threadId, messageId, resourceUrl);

    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
    expect(context.getState().threads[threadId].chatMessages[messageId].resourceCache).toEqual(expectedResourceCache);
  });
});
