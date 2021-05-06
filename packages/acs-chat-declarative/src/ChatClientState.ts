// © Microsoft Corporation. All rights reserved.
import { ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { ReadReceipt } from './types/ReadReceipt';
import { TypingIndicator } from './types/TypingIndicator';

export type ChatClientState = {
  userId: CommunicationIdentifierKind;
  displayName: string;
  threads: Map<string, ChatThreadClientState>;
};

export type ChatThreadClientState = {
  chatMessages: Map<string, ChatMessageWithStatus>;
  // Keys are stringified CommunicationIdentifier objects.
  // The stringified format is a (leaked) implementation detail.
  //
  // TODO: Consider replacing this Map with Array:
  // - Redux and other data stores can't store objects that contain Map.
  // - There is no standard string representation of CommunicationIdentifier.
  participants: Map<string, ChatParticipant>;
  threadId: string;
  properties?: ChatThreadProperties;
  coolPeriod?: Date;
  getThreadMembersError?: boolean;
  updateThreadMembersError?: boolean;
  failedMessageIds: string[];
  readReceipts: ReadReceipt[];
  typingIndicators: TypingIndicator[];
  latestReadTime: Date;
};

// @azure/communication-chat exports two interfaces for this concept,
// and @azure/communication-signaling exports one.
// In the absence of a common interface for this concept, we define a minimal one
// that helps us hide the different types used by underlying API.
export type ChatThreadProperties = {
  topic?: string;
};
