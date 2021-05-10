// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifierKind } from '@azure/communication-common';

export type ChatConfig = {
  userId: CommunicationIdentifierKind;
  displayName: string;
};
