// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatErrors, ChatThreadClientState } from '@internal/chat-stateful-client';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { ChatAdapterState, ObservableFileUpload } from '..';
import { ChatContext } from './AzureCommunicationChatAdapter';
import { AzureCommunicationFileUploadAdapter } from './AzureCommunicationFileUploadAdapter';

describe('registerFileUploads()', () => {
  test('should create file uploads in state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    adapter.registerFileUploads(generateObservableFileUploads(1));
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(1);
  });

  test('should append file uploads to state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    adapter.registerFileUploads(generateObservableFileUploads(1));
    adapter.registerFileUploads(generateObservableFileUploads(1));
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(2);
  });

  test('should append file uploads to state without changing existing file uploads', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    const fileUploads_1 = generateObservableFileUploads(1);
    adapter.registerFileUploads(fileUploads_1);
    chatContext.setState(
      produce(chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.fileUploads?.[fileUploads_1[0].id]) {
          draft.fileUploads[fileUploads_1[0].id].progress = 0.75;
        }
      })
    );
    const fileUploads_2 = generateObservableFileUploads(1);
    adapter.registerFileUploads(fileUploads_2);
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(2);
    expect(chatContext.getState().fileUploads?.[fileUploads_1[0].id].progress).toBe(0.75);
  });

  test('should remove erroneous file uploads from state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    const fileUploads = generateObservableFileUploads(2);
    adapter.registerFileUploads(fileUploads);
    chatContext.setState(
      produce(chatContext.getState(), (draft: ChatAdapterState) => {
        if (draft.fileUploads?.[fileUploads[0].id]) {
          draft.fileUploads[fileUploads[0].id].errorMessage = 'Sample Error Message';
        }
      })
    );
    adapter.registerFileUploads(generateObservableFileUploads(2));
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(3);
  });
});

describe('clearFileUploads()', () => {
  test('should remove all file uploads from state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    adapter.registerFileUploads(generateObservableFileUploads(5));
    adapter.clearFileUploads();
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(0);
  });
});

describe('cancelFileUpload()', () => {
  test('should remove file upload from state', () => {
    const chatContext = createChatContext();
    const adapter = new AzureCommunicationFileUploadAdapter(chatContext);
    const fileUploads = generateObservableFileUploads(5);
    adapter.registerFileUploads(fileUploads);
    adapter.cancelFileUpload(fileUploads[0].id);
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(4);
    adapter.cancelFileUpload(fileUploads[1].id);
    expect(Object.values(chatContext.getState().fileUploads || {}).length).toBe(3);
  });
});

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

const generateObservableFileUploads = (quantity: number): ObservableFileUpload[] => {
  const fileUploads: ObservableFileUpload[] = [];
  for (let i = 0; i < quantity; i++) {
    fileUploads.push({
      fileName: `SampleName-${nanoid()}.pdf`,
      id: `SampleID-${nanoid()}`,
      on() {
        // noop
      },
      off() {
        // noop
      }
    });
  }
  return fileUploads;
};
