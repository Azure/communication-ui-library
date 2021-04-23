// © Microsoft Corporation. All rights reserved.
import { ChatThreadInfo, ChatParticipant } from '@azure/communication-chat';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { ReadReceipt } from './types/ReadReceipt';
import { TypingIndicator } from './types/TypingIndicator';

export type ChatClientState = {
  userId: string;
  displayName: string;
  threads: Map<string, ChatThreadClientState>;
};

export type ChatThreadClientState = {
  chatMessages: Map<string, ChatMessageWithStatus>;
  participants: Map<string, ChatParticipant>;
  threadId: string;
  threadInfo?: ChatThreadInfo;
  coolPeriod?: Date;
  getThreadMembersError?: boolean;
  updateThreadMembersError?: boolean;
  failedMessageIds: string[];
  readReceipts: ReadReceipt[];
  typingIndicators: TypingIndicator[];
  latestReadTime: Date;
};
