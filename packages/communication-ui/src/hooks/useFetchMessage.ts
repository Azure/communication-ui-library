// © Microsoft Corporation. All rights reserved.

import { ChatMessage, ChatThreadClient, GetChatMessageResponse } from '@azure/communication-chat';
import { useCallback } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { OK, TOO_MANY_REQUESTS_STATUS_CODE } from '../constants';

import { useChatThreadClient } from '../providers/ChatThreadProvider';

const fetchMessageInternal = async (
  chatThreadClient: ChatThreadClient,
  messageId: string
): Promise<ChatMessage | undefined> => {
  let messageResponse: GetChatMessageResponse;
  try {
    messageResponse = await chatThreadClient.getMessage(messageId);
  } catch (error) {
    throw new CommunicationUiError({
      message: 'Error getting message',
      code: CommunicationUiErrorCode.GET_MESSAGE_ERROR,
      error
    });
  }
  if (messageResponse._response.status === OK) {
    const { _response, ...chatMessage } = messageResponse;
    return chatMessage;
  } else if (messageResponse._response.status === TOO_MANY_REQUESTS_STATUS_CODE) {
    // TODO: looks like these console.errors are ok to happen so we don't throw but we should replace these with logger
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
    throw new CommunicationUiError({
      message: 'ChatThreadClient is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  const fetchMessage = useCallback(
    async (messageId: string): Promise<ChatMessage | undefined> => {
      return await fetchMessageInternal(chatThreadClient, messageId);
    },
    [chatThreadClient]
  );
  return fetchMessage;
};
