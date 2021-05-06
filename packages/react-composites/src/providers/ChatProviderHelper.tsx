// © Microsoft Corporation. All rights reserved.

/**
 * This file was created to extract circular dependencies between ChatProvider and ChatThreadProvider that both
 * had dependencies on each other.
 */

import { ChatClient } from '@azure/communication-chat';
import { Dispatch, SetStateAction, useContext, createContext } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';

// The following need explicitly imported to avoid api-extractor issues.
// These can be removed once https://github.com/microsoft/rushstack/pull/1916 is fixed.
// @ts-ignore
import React from 'react';

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export type ChatContextType = {
  chatClient?: ChatClient;
  setChatClient: Dispatch<SetStateAction<ChatClient>>;
};

export const useChatClient = (): ChatClient => {
  const chatContext = useContext<ChatContextType | undefined>(ChatContext);
  if (chatContext === undefined) {
    throw new CommunicationUiError({
      message: 'UseChatClient invoked when ChatContext not initialized',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  if (chatContext.chatClient === undefined) {
    throw new CommunicationUiError({
      message: 'UseChatClient invoked with ChatClient not initialized',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  return chatContext.chatClient;
};
