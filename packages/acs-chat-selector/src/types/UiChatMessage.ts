// © Microsoft Corporation. All rights reserved.
import { MessageStatus } from '@azure/acs-chat-declarative';

export enum MessageAttachedStatus {
  BOTTOM = 'bottom',
  TOP = 'top'
}

export type UiChatMessage = {
  messageId?: string;
  content?: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  statusToRender?: MessageStatus;
  status?: MessageStatus;
  attached?: MessageAttachedStatus;
  mine?: boolean;
  clientMessageId?: string;
};
