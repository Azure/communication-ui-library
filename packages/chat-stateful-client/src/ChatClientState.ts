// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessageReadReceipt, ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { FlatCommunicationIdentifier } from 'acs-ui-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';

export type ChatClientState = {
  userId: CommunicationIdentifierKind;
  displayName: string;
  threads: Map<string, ChatThreadClientState>;
};

export type ChatThreadClientState = {
  chatMessages: Map<string, ChatMessageWithStatus>;
  // Keys are stringified CommunicationIdentifier objects.
  //
  // TODO: Consider replacing this Map with Array:
  // - Redux and other data stores can't store objects that contain Map.
  participants: Map<FlatCommunicationIdentifier, ChatParticipant>;
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
