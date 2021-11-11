// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';

export interface Model {
  threads: Thread[];
}

export interface Thread {
  id: string;
  topic: string;
  createdOn: Date;
  createdBy: CommunicationIdentifier;
  participants: ChatParticipant[];
}
