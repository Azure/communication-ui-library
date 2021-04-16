// © Microsoft Corporation. All rights reserved.
import { MessageStatus } from '@azure/acs-chat-declarative';

export enum MessageAttachedStatus {
  BOTTOM = 'bottom',
  TOP = 'top'
}

/**
 * This is the Message item returned by our selectors, which should match the message type consumed by components.
 */
export type ChatMessagePayload = {
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

export type SystemMessagePayload = {
  content?: string;
  iconName?: string;
};

export type MessageTypes = 'chat' | 'system' | 'custom';

export type Message<T extends MessageTypes> = {
  type: T;
  payload: T extends 'chat' ? ChatMessagePayload : T extends 'system' ? SystemMessagePayload : { [name: string]: any };
};

export type ChatMessage = Message<'chat'>;
export type SystemMessage = Message<'system'>;
export type CustomMessage = Message<'custom'>;
