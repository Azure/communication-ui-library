// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(file-sharing) */
import { ChatErrors, ChatThreadClientState } from '@internal/chat-stateful-client';
/* @conditional-compile-remove(file-sharing) */
import produce from 'immer';
/* @conditional-compile-remove(file-sharing) */
import { v1 as generateGUID } from 'uuid';
/* @conditional-compile-remove(file-sharing) */
import { ChatAdapterState } from '..';
/* @conditional-compile-remove(file-sharing) */
import { ChatContext } from './AzureCommunicationChatAdapter';
/* @conditional-compile-remove(file-sharing) */
import { AzureCommunicationFileUploadAdapter } from './AzureCommunicationFileUploadAdapter';

test('workaround for conditional compilation. Test suite must contain at least one test', () => {
  expect(true).toBeTruthy();
});

/* @conditional-compile-remove(file-sharing) */
describe('registerFileUploads()', () => {
  test('should create file uploads in state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    adapter.registerActiveFileUploads(generateFiles(1));
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(1);
  });

  test('should append file uploads to state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    adapter.registerActiveFileUploads(generateFiles(1));
    adapter.registerActiveFileUploads(generateFiles(1));
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(2);
  });

  test('should append file uploads to state without changing existing file uploads', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    const fileUploads_1 = adapter.registerActiveFileUploads(generateFiles(1));
    chatContext.setState(
      produce(chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.fileUploads?.[fileUploads_1[0].id]) {
          draft.fileUploads[fileUploads_1[0].id].progress = 0.75;
        }
      })
    );
    adapter.registerActiveFileUploads(generateFiles(1));
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(2);
    expect(chatContext.getState().fileUploads?.[fileUploads_1[0].id].progress).toBe(0.75);
  });

  test('should remove erroneous file uploads from state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    const fileUploads = adapter.registerActiveFileUploads(generateFiles(2));
    chatContext.setState(
      produce(chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.fileUploads?.[fileUploads[0].id]) {
          draft.fileUploads[fileUploads[0].id].error = { message: 'Sample Error Message', timestamp: Date.now() };
        }
      })
    );
    adapter.registerActiveFileUploads(generateFiles(2));
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(3);
  });
});

/* @conditional-compile-remove(file-sharing) */
describe('clearFileUploads()', () => {
  test('should remove all file uploads from state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    adapter.registerActiveFileUploads(generateFiles(5));
    adapter.clearFileUploads();
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(0);
  });
});

/* @conditional-compile-remove(file-sharing) */
describe('cancelFileUpload()', () => {
  test('should remove file upload from state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    const fileUploads = adapter.registerActiveFileUploads(generateFiles(5));
    adapter.cancelFileUpload(fileUploads[0].id);
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(4);
    adapter.cancelFileUpload(fileUploads[1].id);
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(3);
  });
});

/* @conditional-compile-remove(file-sharing) */
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

/* @conditional-compile-remove(file-sharing) */
const generateFiles = (quantity: number): File[] => {
  return Array.from({ length: quantity }, () => new File([], generateGUID(), { type: 'text/plain' }));
};

export default {};
