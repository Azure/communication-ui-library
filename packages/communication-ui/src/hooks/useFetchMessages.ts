// © Microsoft Corporation. All rights reserved.

import { ChatMessage, ChatThreadClient, RestListMessagesOptions } from '@azure/communication-chat';
import { useChatThreadClient, useSetChatMessages } from '../providers/ChatThreadProvider';

import { TEXT_MESSAGE } from '../constants';
import { useCallback } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';

const fetchMessagesInternal = async (
  chatThreadClient: ChatThreadClient,
  options?: RestListMessagesOptions
): Promise<ChatMessage[]> => {
  let messages: ChatMessage[] = [];
  let getMessagesResponse;
  try {
    getMessagesResponse = chatThreadClient.listMessages(options);
  } catch (error) {
    throw new CommunicationUiError({
      message: 'Error getting messages',
      code: CommunicationUiErrorCode.GET_MESSAGES_ERROR
    });
  }
  for await (const message of getMessagesResponse) {
    messages.push(message);
  }

  // filter to only text messages
  messages = messages.filter((message) => message.type === TEXT_MESSAGE);
  return messages.reverse();
};

export const useFetchMessages = (): ((options?: RestListMessagesOptions) => Promise<ChatMessage[]>) => {
  const chatThreadClient = useChatThreadClient();
  const setChatMessages = useSetChatMessages();
  if (!chatThreadClient) {
    throw new CommunicationUiError({
      message: 'ChatThreadClient is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  const fetchMessages = useCallback(
    async (options?: RestListMessagesOptions): Promise<ChatMessage[]> => {
      const messages = await fetchMessagesInternal(chatThreadClient, options);
      setChatMessages(messages);
      return messages;
    },
    [chatThreadClient, setChatMessages]
  );
  return fetchMessages;
};
