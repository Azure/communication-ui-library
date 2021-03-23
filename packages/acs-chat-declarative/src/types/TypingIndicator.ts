// © Microsoft Corporation. All rights reserved.

import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';

export type TypingIndicator = Omit<TypingIndicatorReceivedEvent, 'receivedOn'> & {
  senderId: string;
  receivedOn: Date;
};
