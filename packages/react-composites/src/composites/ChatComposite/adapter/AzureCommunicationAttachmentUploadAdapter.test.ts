// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(attachment-upload) */
import { ChatErrors, ChatThreadClientState } from '@internal/chat-stateful-client';
/* @conditional-compile-remove(attachment-upload) */
import { produce } from 'immer';
/* @conditional-compile-remove(attachment-upload) */
import { v1 as generateGUID } from 'uuid';
/* @conditional-compile-remove(attachment-upload) */
import { ChatAdapterState } from '..';
/* @conditional-compile-remove(attachment-upload) */
import { ChatContext } from './AzureCommunicationChatAdapter';
/* @conditional-compile-remove(attachment-upload) */
import { AzureCommunicationAttachmentUploadAdapter } from './AzureCommunicationAttachmentUploadAdapter';

test('workaround for conditional compilation. Test suite must contain at least one test', () => {
  expect(true).toBeTruthy();
});

/* @conditional-compile-remove(attachment-upload) */
describe('registerAttachmentUploads()', () => {
  test('should create attachment uploads in state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationAttachmentUploadAdapter(chatContext);
    adapter.registerActiveUploads(generateFiles(1));
    expect(Object.values(chatContext.getState().attachmentUploads || {}).length).toBe(1);
  });

  test('should append attachment uploads to state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationAttachmentUploadAdapter(chatContext);
    adapter.registerActiveUploads(generateFiles(1));
    adapter.registerActiveUploads(generateFiles(1));
    expect(Object.values(chatContext.getState().attachmentUploads || {}).length).toBe(2);
  });

  test('should append attachment uploads to state without changing existing attachment uploads', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationAttachmentUploadAdapter(chatContext);
    const attachmentUploads_1 = adapter.registerActiveUploads(generateFiles(1));
    chatContext.setState(
      produce(chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.attachmentUploads?.[attachmentUploads_1[0].sessionId]) {
          draft.attachmentUploads[attachmentUploads_1[0].sessionId].progress = 0.75;
        }
      })
    );
    adapter.registerActiveUploads(generateFiles(1));
    expect(Object.values(chatContext.getState().attachmentUploads || {}).length).toBe(2);
    expect(chatContext.getState().attachmentUploads?.[attachmentUploads_1[0].sessionId].progress).toBe(0.75);
  });

  test('should remove erroneous attachment uploads from state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationAttachmentUploadAdapter(chatContext);
    const attachmentUploads = adapter.registerActiveUploads(generateFiles(2));
    chatContext.setState(
      produce(chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.attachmentUploads?.[attachmentUploads[0].sessionId]) {
          draft.attachmentUploads[attachmentUploads[0].sessionId].uploadError = {
            message: 'Sample Error Message',
            timestamp: Date.now()
          };
        }
      })
    );
    adapter.registerActiveUploads(generateFiles(2));
    expect(Object.values(chatContext.getState().attachmentUploads || {}).length).toBe(3);
  });
});

/* @conditional-compile-remove(attachment-upload) */
describe('clearUploads()', () => {
  test('should remove all attachment uploads from state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationAttachmentUploadAdapter(chatContext);
    adapter.registerActiveUploads(generateFiles(5));
    adapter.clearUploads();
    expect(Object.values(chatContext.getState().attachmentUploads || {}).length).toBe(0);
  });
});

/* @conditional-compile-remove(attachment-upload) */
describe('cancelUpload()', () => {
  test('should remove attachment upload from state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationAttachmentUploadAdapter(chatContext);
    const attachmentUploads = adapter.registerActiveUploads(generateFiles(5));
    adapter.cancelUpload(attachmentUploads[0].sessionId);
    expect(Object.values(chatContext.getState().attachmentUploads || {}).length).toBe(4);
    adapter.cancelUpload(attachmentUploads[1].sessionId);
    expect(Object.values(chatContext.getState().attachmentUploads || {}).length).toBe(3);
  });
});

/* @conditional-compile-remove(attachment-upload) */
const createChatContext = (): ChatContext =>
  new ChatContext(
    {
      displayName: '',
      userId: { communicationUserId: 'userId', kind: 'communicationUser' },
      threads: {
        threadId: {} as ChatThreadClientState
      },
      latestErrors: {} as ChatErrors
    },
    'threadId'
  );

/* @conditional-compile-remove(attachment-upload) */
const generateFiles = (quantity: number): File[] => {
  return Array.from({ length: quantity }, () => new File([], generateGUID(), { type: 'text/plain' }));
};

export default {};
