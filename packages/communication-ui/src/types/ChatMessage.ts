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

// Todo: We need to add more types of system messages that we support.
export type SystemMessageTypes = 'ParticipantAdded' | 'ParticipantRemoved';

export type SystemMessage = {
  type: SystemMessageTypes;
  content?: string;
};

export type MessageTypes = 'chat' | 'system' | 'custom';

export type Message<T extends MessageTypes> = {
  type: T;
  payload: T extends 'chat' ? ChatMessage : T extends 'system' ? SystemMessage : { [name: string]: any };
};
