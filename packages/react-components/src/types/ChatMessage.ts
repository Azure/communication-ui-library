// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type MessageStatus = 'delivered' | 'sending' | 'seen' | 'failed';
export type MessageAttachedStatus = 'bottom' | 'top';

export type MessageContentType = 'text' | 'html' | 'RichText/Html' | 'unknown';

export type ChatMessagePayload = {
  messageId?: string;
  content?: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  status?: MessageStatus;
  attached?: MessageAttachedStatus | boolean;
  mine?: boolean;
  clientMessageId?: string;
  type: MessageContentType;
};

export type SystemMessagePayload = {
  messageId: string;
  content?: string;
  iconName?: string;
};

export type CustomMessagePayload = {
  messageId: string;
  content?: string;
};

export type MessageTypes = 'chat' | 'system' | 'custom';

export type Message<T extends MessageTypes> = {
  type: T;
  payload: T extends 'chat' ? ChatMessagePayload : T extends 'system' ? SystemMessagePayload : CustomMessagePayload;
};

export type ChatMessage = Message<'chat'>;
export type SystemMessage = Message<'system'>;
export type CustomMessage = Message<'custom'>;
