// © Microsoft Corporation. All rights reserved.

export enum MessageStatus {
  DELIVERED = 'delivered',
  SENDING = 'sending',
  SEEN = 'seen',
  FAILED = 'failed'
}

export type ChatMessage = {
  messageId?: string;
  content?: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  status: MessageStatus;
};
