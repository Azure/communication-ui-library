// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { FileUploadAdapter } from './AzureCommunicationFileUploadAdapter';
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
export const useFileUploadAdapter = (): FileUploadAdapter => {
  /* @conditional-compile-remove(file-sharing) */
  return useAdapter();
  // A stub that short-circuits all logic because none of the fields are available.
  return {
    registerFileUploads() {
      // noop
    },
    cancelFileUpload() {
      // noop
    },
    clearFileUploads() {
      // noop
    }
  };
};
