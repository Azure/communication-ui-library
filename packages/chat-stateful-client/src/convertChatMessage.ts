// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import { MessageStatus } from '@internal/acs-ui-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';

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
