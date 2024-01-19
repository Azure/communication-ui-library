// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { ChatThreadClient } from '@azure/communication-chat';

/** @private */
export interface ChatComponentBindingState {
  teamsAttachments: TeamsAttachment[];
}

/** @private */
export interface ChatComponentBindingHandlers {
  fetchTeamsAttachment: (url: string) => Promise<void>;
}

type ChatComponentBindingProps = ChatComponentBindingState & ChatComponentBindingHandlers;

/** @private */
export const ChatComponentBindingContext = createContext<ChatComponentBindingProps | undefined>(undefined);

/** @private */
export type ChatComponentBindingProviderProps = {
  children: React.ReactNode;
  chatThreadClient: ChatThreadClient;
};

/**
 * A {@link React.Context} that stores a rendering properties specific to components.
 * These are properties that do not apply to the {@link StatefulChatClient}.
 *
 * @private
 */
export const ChatComponentBindingProvider = (props: ChatComponentBindingProviderProps): JSX.Element => {
  const [teamsAttachments, setTeamsAttachments] = useState<TeamsAttachment[]>([]);
  const fetchTeamsAttachment = useCallback(
    async (url: string): Promise<void> => {
      const hasAttachmentAlready = teamsAttachments.find((attachment) => attachment.url === url);
      if (hasAttachmentAlready) {
        return;
      }

      const fetchedAttachment: TeamsAttachment = await (await fetch(url)).json(); // a mock fetch as an example
      setTeamsAttachments((prevTeamsAttachments) => {
        return [...prevTeamsAttachments, fetchedAttachment];
      });
    },
    [teamsAttachments]
  );

  const data: ChatComponentBindingProps = useMemo(() => {
    return {
      teamsAttachments,
      fetchTeamsAttachment
    };
  }, [teamsAttachments, fetchTeamsAttachment]);

  return <ChatComponentBindingContext.Provider value={data}>{props.children}</ChatComponentBindingContext.Provider>;
};

/**
 * Hook to obtain the component bindings state with a validation check.
 * @private
 */
export const useChatComponentBindingState = (): ChatComponentBindingState => {
  const chatComponentBindingState = useContext(ChatComponentBindingContext); // todo split state and handlers in this
  if (!chatComponentBindingState) {
    throw new Error('Please wrap components with a ChatThreadClientProvider before calling the hook.');
  }
  return chatComponentBindingState;
};

/**
 * Hook to obtain the component bindings handlers with a validation check.
 * @private
 */
export const useChatComponentBindingHandlers = (): ChatComponentBindingHandlers => {
  const chatComponentBindingHandlers = useContext(ChatComponentBindingContext); // todo split state and handlers in this
  if (!chatComponentBindingHandlers) {
    throw new Error('Please wrap components with a ChatThreadClientProvider before calling the hook.');
  }
  return chatComponentBindingHandlers;
};

/**
 * Interface for example only
 * @private
 */
export type TeamsAttachment = {
  url: string;
  expiry?: Date;
  onRefreshAccess?: () => void;
};
