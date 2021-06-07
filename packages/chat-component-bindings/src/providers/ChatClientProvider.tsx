// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { StatefulChatClient } from 'chat-stateful-client';

export const ChatClientContext = createContext<StatefulChatClient | undefined>(undefined);

export type ChatClientProviderProps = {
  children: React.ReactNode;
  chatClient: StatefulChatClient;
};

/**
 * ChatClientProvider requires valid StatefulChatClient. It provides a global access to the
 * stateful chat client for the contoso app
 *
 * @param props - only one parameter StatefulChatClient
 */
export const ChatClientProvider = (props: ChatClientProviderProps): JSX.Element => {
  return <ChatClientContext.Provider value={props.chatClient}>{props.children}</ChatClientContext.Provider>;
};

export const useChatClient = (): StatefulChatClient => {
  const chatClient = useContext(ChatClientContext);
  if (!chatClient)
    throw 'Please wrap components with ChatClientProvider and initialize a chat client before calling the hook!';
  return chatClient;
};
