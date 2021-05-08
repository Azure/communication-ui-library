// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import {
  CommunicationIdentifier,
  CommunicationIdentifierKind,
  isCommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier
} from '@azure/communication-common';
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
  //
  // TODO: Consider replacing this Map with Array:
  // - Redux and other data stores can't store objects that contain Map.
  // - There is no standard string representation of CommunicationIdentifier
  //   in the underlying SDKs.
  participants: Map<CommunicationIdentifierAsKey, ChatParticipant>;
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

// A string representation of CommunicationIdentifier used as keys
// in Maps exported from this package.
//
// The string formatting is an implementation detail and may be changed
// without notice.
export type CommunicationIdentifierAsKey = string;

export const getCommunicationIdentifierAsKey = (identifier: CommunicationIdentifier): CommunicationIdentifierAsKey => {
  if (isCommunicationUserIdentifier(identifier)) {
    return identifier.communicationUserId;
  }
  if (isMicrosoftTeamsUserIdentifier(identifier)) {
    return identifier.microsoftTeamsUserId;
  }
  if (isPhoneNumberIdentifier(identifier)) {
    return identifier.phoneNumber;
  }
  return identifier.id;
};
