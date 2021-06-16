// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessageReadReceipt, ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';

export type ChatClientState = {
  userId: CommunicationIdentifierKind;
  displayName: string;
  /**
   * Chat threads joined by the current user.
   * Object with {@Link ChatThreadClientState} fields, keyed by {@Link ChatThreadClientState.threadId}.
   */
  threads: { [key: string]: ChatThreadClientState };
};

export type ChatThreadClientState = {
  /**
   * Messages in this thread.
   * Object with {@Link ChatMessageWithStatus} entries
   * Local messages are keyed by keyed by {@Link ChatMessageWithStatus.clientMessageId}.
   * Remote messages are keyed by {@Link @azure/communication-chat#ChatMessage.id}.
   */
  chatMessages: { [key: string]: ChatMessageWithStatus };
  /**
   * Participants of this chat thread.
   *
   * Object with {@Link @azure/communication-chat#ChatParticipant} fields,
   * keyed by {@Link @azure/communication-chat#ChatParticipant.id}.
   */
  participants: { [key: string]: ChatParticipant };
  threadId: string;
  properties?: ChatThreadProperties;
  readReceipts: ChatMessageReadReceipt[];
  typingIndicators: TypingIndicatorReceivedEvent[];
  latestReadTime: Date;
};

// @azure/communication-chat exports two interfaces for this concept,
// and @azure/communication-signaling exports one.
// In the absence of a common interface for this concept, we define a minimal one
// that helps us hide the different types used by underlying API.
export type ChatThreadProperties = {
  topic?: string;
};
