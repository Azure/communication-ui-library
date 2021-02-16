// © Microsoft Corporation. All rights reserved.

import { ChatMessage, ChatThreadClient, ListMessagesOptions } from '@azure/communication-chat';
import { useChatThreadClient, useSetChatMessages } from '../providers/ChatThreadProvider';

import { TEXT_MESSAGE } from '../constants';
import { useCallback } from 'react';

const fetchMessagesInternal = async (
  chatThreadClient: ChatThreadClient,
  options?: ListMessagesOptions
): Promise<ChatMessage[]> => {
  let messages: ChatMessage[] = [];
  const getMessagesResponse = chatThreadClient.listMessages(options);
  for await (const message of getMessagesResponse) {
    messages.push(message);
  }
  if (messages.length === 0) {
    throw new Error('Unable to fetch messages from server');
  }
  // filter to only text messages
  messages = messages.filter((message) => message.type === TEXT_MESSAGE);
  return messages.reverse();
};

export const useFetchMessages = (): ((options?: ListMessagesOptions) => Promise<ChatMessage[]>) => {
  const chatThreadClient = useChatThreadClient();
  const setChatMessages = useSetChatMessages();
  if (!chatThreadClient) {
    throw new Error('chatThreadClient is undefined');
  }
  const fetchMessages = useCallback(
    async (options?: ListMessagesOptions): Promise<ChatMessage[]> => {
      const messages = await fetchMessagesInternal(chatThreadClient, options);
      setChatMessages(messages);
      return messages;
    },
    [chatThreadClient, setChatMessages]
  );
  return fetchMessages;
};
