// © Microsoft Corporation. All rights reserved.

import { ChatMessage } from '@azure/communication-chat';
import { ChatMessageWithStatus, MessageStatus } from './types/ChatMessageWithStatus';

export const convertChatMessage = (
  message: ChatMessage,
  status: MessageStatus = 'delivered',
  clientMessageId?: string
): ChatMessageWithStatus => {
  return {
    ...message,
    clientMessageId: clientMessageId,
    status
  };
};
