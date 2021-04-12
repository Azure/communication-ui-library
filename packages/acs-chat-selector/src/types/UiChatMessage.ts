// © Microsoft Corporation. All rights reserved.
import { MessageStatus } from '@azure/acs-chat-declarative';

export enum MessageAttachedStatus {
  BOTTOM = 'bottom',
  TOP = 'top'
}

/**
 * This is the Message item returned by our selectors, which should match the message type consumed by components.
 */
export type UiChatMessage = {
  messageId?: string;
  content?: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  statusToRender?: MessageStatus;
  status?: MessageStatus;
  attached?: MessageAttachedStatus | boolean;
  mine?: boolean;
  clientMessageId?: string;
};
