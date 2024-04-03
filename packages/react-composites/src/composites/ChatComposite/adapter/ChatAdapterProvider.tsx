// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { createContext, useContext } from 'react';
import { AttachmentUploadManager } from '@internal/react-components';
import { AttachmentUploadAdapter } from './AzureCommunicationAttachmentUploadAdapter';
import { ChatAdapter } from './ChatAdapter';

/**
 * @private
 */
type ChatProviderProps = {
  children: React.ReactNode;
  adapter: ChatAdapter;
};

const ChatAdapterContext = createContext<ChatAdapter | undefined>(undefined);

/**
 * @private
 */
export const ChatAdapterProvider = (props: ChatProviderProps): JSX.Element => {
  const { adapter } = props;
  return <ChatAdapterContext.Provider value={adapter}>{props.children}</ChatAdapterContext.Provider>;
};

/**
 * @private
 */
export const useAdapter = (): ChatAdapter => {
  const adapter = useContext(ChatAdapterContext);
  if (!adapter) {
    throw 'Cannot find adapter please initialize before usage.';
  }
  return adapter;
};

/**
 * @private
 */
export const useAttachmentUploadAdapter = (): AttachmentUploadAdapter => {
  /* @conditional-compile-remove(attachment-upload) */
  return useAdapter();
  // A stub that short-circuits all logic because none of the fields are available.
  return {
    registerActiveUploads() {
      return [] as AttachmentUploadManager[];
    },
    registerCompletedUploads() {
      return [] as AttachmentUploadManager[];
    },
    cancelUpload() {
      // noop
    },
    clearUploads() {
      // noop
    },
    updateUploadStatusMessage() {
      // noop
    },
    updateUploadProgress() {
      // noop
    },
    updateUploadMetadata() {
      // noop
    }
  };
};
