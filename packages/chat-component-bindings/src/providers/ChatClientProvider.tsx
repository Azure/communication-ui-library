// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { StatefulChatClient } from '@internal/chat-stateful-client';

/**
 * @private
 */
export const ChatClientContext = createContext<StatefulChatClient | undefined>(undefined);

/**
 * Arguments to initialize a {@link ChatClientProvider}.
 *
 * @public
 */
export type ChatClientProviderProps = {
  children: React.ReactNode;
  chatClient: StatefulChatClient;
};

/**
 * A {@link React.Context} that stores a {@link StatefulChatClient}.
 *
 * Chat components from this package must be wrapped with a {@link ChatClientProvider}.
 *
 * @public
 */
export const ChatClientProvider = (props: ChatClientProviderProps): JSX.Element => {
  return <ChatClientContext.Provider value={props.chatClient}>{props.children}</ChatClientContext.Provider>;
};

/**
 * Hook to obtain {@link StatefulChatClient} from the provider.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useChatClient = (): StatefulChatClient => {
  const chatClient = useContext(ChatClientContext);
  if (!chatClient)
    throw 'Please wrap components with ChatClientProvider and initialize a chat client before calling the hook!';
  return chatClient;
};
