// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessageReadReceipt, ChatThreadInfo, ChatParticipant } from '@azure/communication-chat';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { TypingIndicatorEvent } from './types/TypingIndicatorEvent';

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
  readReceipts: ChatMessageReadReceipt[];
  typingIndicators: TypingIndicatorEvent[];
  latestReadTime: Date;
};
