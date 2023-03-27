// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import { MessageStatus } from '@internal/acs-ui-common';

/**
 * An extension to {@link @azure/communication-chat#ChatMessage} that stores
 * client-side only metadata for chat messages.
 *
 * TODO: The name has bitrotted. Rename me.
 *
 * @public
 */
export type ChatMessageWithStatus = ChatMessage & {
  clientMessageId?: string;
  status: MessageStatus;
  /* @conditional-compile-remove(data-loss-prevention) */
  policyViolation?: boolean;
};
