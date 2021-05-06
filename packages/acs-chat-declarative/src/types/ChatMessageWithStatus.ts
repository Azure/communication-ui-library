//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';

export type MessageStatus = 'delivered' | 'sending' | 'seen' | 'failed';

export type ChatMessageWithStatus = ChatMessage & {
  clientMessageId?: string;
  status: MessageStatus;
};
