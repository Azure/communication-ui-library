// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';

export type TypingIndicator = Omit<TypingIndicatorReceivedEvent, 'receivedOn'> & {
  receivedOn: Date;
};
