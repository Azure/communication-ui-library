// © Microsoft Corporation. All rights reserved.
import { ChatThread } from '@azure/communication-chat';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';

export type ChatClientState = {
  userId: string;
  displayName: string;
  threads: Map<string, ChatThreadClientState>;
};

export type ChatThreadClientState = {
  chatMessages: Map<string, ChatMessageWithStatus>;
  threadId: string;
  thread?: ChatThread;
  coolPeriod?: Date;
  getThreadMembersError?: boolean;
  updateThreadMembersError?: boolean;
  failedMessageIds: string[];
};
