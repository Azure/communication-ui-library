// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import { ChatMessageWithStatus, ChatMessageStatus } from './types/ChatMessageWithStatus';

export const convertChatMessage = (
  message: ChatMessage,
  status: ChatMessageStatus = 'delivered',
  clientMessageId?: string
): ChatMessageWithStatus => {
  return {
    ...message,
    clientMessageId: clientMessageId,
    status
  };
};
