// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant, ChatMessage } from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';

export interface Model {
  threads: Thread[];
}

export interface Thread {
  id: string;
  topic: string;
  createdOn: Date;
  deltedOn?: Date;
  createdBy: CommunicationIdentifier;
  participants: ChatParticipant[];
  messages: ChatMessage[];
}

export const latestMessageTimestamp = (messages: ChatMessage[]): Date | undefined => {
  if (messages.length === 0) {
    return undefined;
  }
  return messages[messages.length - 1].createdOn;
};
