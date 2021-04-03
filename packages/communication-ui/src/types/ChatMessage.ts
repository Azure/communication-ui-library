// © Microsoft Corporation. All rights reserved.

export type MessageStatus = 'delivered' | 'sending' | 'seen' | 'failed';
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
  attached?: MessageAttachedStatus;
  mine?: boolean;
  clientMessageId?: string;
};
