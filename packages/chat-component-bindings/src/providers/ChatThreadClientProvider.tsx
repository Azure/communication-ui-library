// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { ChatThreadClient } from '@azure/communication-chat';

/**
 * @private
 */
export const ChatThreadClientContext = createContext<ChatThreadClient | undefined>(undefined);

/**
 * Arguments to initialize a {@link ChatThreadClientProvider}.
 *
 * @public
 */
export type ChatThreadClientProviderProps = {
  children: React.ReactNode;
  chatThreadClient: ChatThreadClient;
};

/**
 * A {@link React.Context} that stores a {@link @azure/communication-chat#ChatThreadClient}.
 *
 * Chat components from this package must be wrapped with a {@link ChatThreadClientProvider}.
 *
 * @public
 */
export const ChatThreadClientProvider = (props: ChatThreadClientProviderProps): JSX.Element => {
  return (
    <ChatThreadClientContext.Provider value={props.chatThreadClient}>{props.children}</ChatThreadClientContext.Provider>
  );
};
/**
 * Hook to obtain {@link @azure/communication-chat#ChatThreadClient} from the provider.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useChatThreadClient = (): ChatThreadClient => {
  const chatThreadClient = useContext(ChatThreadClientContext);
  if (!chatThreadClient)
    throw 'Please wrap components with ChatThreadClientProvider and initialize a chat thread client before calling the hook.';
  return chatThreadClient;
};
