// © Microsoft Corporation. All rights reserved.

import { CommunicationIdentifierKind } from '@azure/communication-common';

export type WebUiChatParticipant = {
  // TODO(prprabhu): Rename to id to be consistent with ChatParticipant.
  userId: CommunicationIdentifierKind;
  displayName?: string;
};
