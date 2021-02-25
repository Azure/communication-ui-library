// © Microsoft Corporation. All rights reserved.
import { ChatThread, ReadReceipt, ChatThreadMember } from '@azure/communication-chat';
import { ChatMessage } from './types/ChatMessage';

export type ChatClientState = {
  userId: string;
  displayName: string;
  threads: Map<string, ChatThreadClientState>;
};

export type ChatMessageWithLocalId = ChatMessage & {
  clientMessageId?: string;
};

export type ChatThreadClientState = {
  chatMessages?: Map<string, ChatMessageWithLocalId>;
  threadId: string;
  thread?: ChatThread;
  receipts?: ReadReceipt[];
  threadMembers: ChatThreadMember[];
  coolPeriod?: Date;
  getThreadMembersError?: boolean;
  updateThreadMembersError?: boolean;
  failedMessageIds: string[];
};
