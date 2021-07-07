// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import { MessageStatus } from '@internal/acs-ui-common';

export type ChatMessageWithStatus = ChatMessage & {
  clientMessageId?: string;
  status: MessageStatus;
};
