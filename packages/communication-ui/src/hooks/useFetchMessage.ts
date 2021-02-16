// © Microsoft Corporation. All rights reserved.

import { ChatMessage, ChatThreadClient, GetChatMessageResponse } from '@azure/communication-chat';
import { useCallback } from 'react';
import { OK, TOO_MANY_REQUESTS_STATUS_CODE } from '../constants';

import { useChatThreadClient } from '../providers/ChatThreadProvider';

const fetchMessageInternal = async (
  chatThreadClient: ChatThreadClient,
  messageId: string
): Promise<ChatMessage | undefined> => {
  const messageResponse: GetChatMessageResponse = await chatThreadClient.getMessage(messageId);
  if (messageResponse._response.status === OK) {
    const { _response, ...chatMessage } = messageResponse;
    return chatMessage;
  } else if (messageResponse._response.status === TOO_MANY_REQUESTS_STATUS_CODE) {
    console.error('Failed at fetching message, Error: Too many requests');
    return undefined;
  } else {
    console.error('Failed at fetching message, Error: ', messageResponse._response.status);
    return undefined;
  }
};

export const useFetchMessage = (): ((messageId: string) => Promise<ChatMessage | undefined>) => {
  const chatThreadClient = useChatThreadClient();
  if (!chatThreadClient) {
    throw new Error('chatThreadClient is undefined');
  }
  const fetchMessage = useCallback(
    async (messageId: string): Promise<ChatMessage | undefined> => {
      return await fetchMessageInternal(chatThreadClient, messageId);
    },
    [chatThreadClient]
  );
  return fetchMessage;
};
