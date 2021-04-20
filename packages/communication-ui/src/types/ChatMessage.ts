// © Microsoft Corporation. All rights reserved.

export type MessageStatus = 'delivered' | 'sending' | 'seen' | 'failed';
export enum MessageAttachedStatus {
  BOTTOM = 'bottom',
  TOP = 'top'
}

export type ChatMessagePayload = {
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

export type SystemMessagePayload = {
  messageId?: string;
  content?: string;
  iconName?: string;
};

export type CustomMessagePayload = {
  messageId?: string;
};

export type MessageTypes = 'chat' | 'system' | 'custom';

export type Message<T extends MessageTypes> = {
  type: T;
  payload: T extends 'chat' ? ChatMessagePayload : T extends 'system' ? SystemMessagePayload : CustomMessagePayload;
};

export type ChatMessage = Message<'chat'>;
export type SystemMessage = Message<'system'>;
export type CustomMessage = Message<'custom'>;
