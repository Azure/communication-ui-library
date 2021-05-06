// © Microsoft Corporation. All rights reserved.
import { CommunicationIdentifierKind } from '@azure/communication-common';

export type ChatConfig = {
  userId: CommunicationIdentifierKind;
  displayName: string;
};
