// © Microsoft Corporation. All rights reserved.

import React, { createContext, useContext } from 'react';
import { ChatThreadClient } from '@azure/communication-chat';

export const ChatThreadClientContext = createContext<ChatThreadClient | undefined>(undefined);

export type ChatThreadClientProviderProps = {
  children: React.ReactNode;
  chatThreadClient: ChatThreadClient;
};

/**
 * ChatThreadClientProvider requires valid StatefulChatThreadClient. It provides a global access to the
 * stateful chat thread client for the contoso app
 *
 * @param props
 */
export const ChatThreadClientProvider = (props: ChatThreadClientProviderProps): JSX.Element => {
  return (
    <ChatThreadClientContext.Provider value={props.chatThreadClient}>{props.children}</ChatThreadClientContext.Provider>
  );
};

export const useChatThreadClient = (): ChatThreadClient => {
  const chatThreadClient = useContext(ChatThreadClientContext);
  if (!chatThreadClient)
    throw 'Please wrap components with ChatThreadClientProvider and initialize a chat thread client before calling the hook.';
  return chatThreadClient;
};

export const useThreadId = (): string => {
  return useChatThreadClient().threadId;
};
