// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import { MessageStatus } from '@internal/acs-ui-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';

/**
 * @private
 */
export const convertChatMessage = (
  message: ChatMessage,
  status: MessageStatus = 'delivered',
  clientMessageId?: string
): ChatMessageWithStatus => {
  return {
    ...message,
    clientMessageId: clientMessageId,
    status,
    /* @conditional-compile-remove(data-loss-prevention) */
    policyViolation: !!(
      message.sender?.kind === 'microsoftTeamsUser' &&
      !!message.editedOn &&
      message.content?.message === ''
    )
  };
};
