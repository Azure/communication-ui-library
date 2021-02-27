// © Microsoft Corporation. All rights reserved.
import { ChatMessage } from '@azure/communication-chat';

export type MessageStatus = 'delivered' | 'sending' | 'seen' | 'failed';

export type ChatMessageWithStatus = ChatMessage & {
  clientMessageId?: string;
  status: MessageStatus;
};
