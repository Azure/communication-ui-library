// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';

export type TypingIndicatorEvent = Omit<TypingIndicatorReceivedEvent, 'receivedOn'> & {
  receivedOn: Date;
};
