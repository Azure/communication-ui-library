// © Microsoft Corporation. All rights reserved.

export enum MessageStatus {
  DELIVERED = 'delivered',
  SENDING = 'sending',
  SEEN = 'seen',
  FAILED = 'failed'
}

export enum MessageAttachedStatus {
  BOTTOM = 'bottom',
  TOP = 'top'
}

export type ChatMessage = {
  messageId?: string;
  content?: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  statusToRender?: MessageStatus;
  attached?: MessageAttachedStatus | boolean;
  mine?: boolean;
  clientMessageId?: string;
};
