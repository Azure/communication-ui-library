// © Microsoft Corporation. All rights reserved.

import React, { createContext, useContext } from 'react';
import { DeclarativeChatClient } from '@azure/acs-chat-declarative';

export const ChatClientContext = createContext<DeclarativeChatClient | undefined>(undefined);

export type ChatClientProviderProps = {
  children: React.ReactNode;
  chatClient: DeclarativeChatClient;
};

/**
 * ChatClientProvider requires valid StatefulChatClient. It provides a global access to the
 * stateful chat client for the contoso app
 *
 * @param props
 */
export const ChatClientProvider = (props: ChatClientProviderProps): JSX.Element => {
  return <ChatClientContext.Provider value={props.chatClient}>{props.children}</ChatClientContext.Provider>;
};

export const useChatClient = (): DeclarativeChatClient => {
  const chatClient = useContext(ChatClientContext);
  if (!chatClient)
    throw 'Please wrap components with ChatClientProvider and initialize a chat client before calling the hook!';
  return chatClient;
};
