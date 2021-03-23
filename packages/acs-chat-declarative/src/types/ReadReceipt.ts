// © Microsoft Corporation. All rights reserved.

import { ChatMessageReadReceipt } from '@azure/communication-chat';

export type ReadReceipt = ChatMessageReadReceipt & {
  senderId: string;
  chatMessageId: string;
};
