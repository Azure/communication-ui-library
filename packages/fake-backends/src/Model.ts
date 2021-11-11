// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant, ChatMessage, ChatThreadProperties } from '@azure/communication-chat';

export interface Model {
  threads: Thread[];
}

export interface Thread extends ChatThreadProperties {
  participants: ChatParticipant[];
  messages: ChatMessage[];
}

export const latestMessageTimestamp = (messages: ChatMessage[]): Date | undefined => {
  if (messages.length === 0) {
    return undefined;
  }
  return messages[messages.length - 1].createdOn;
};
