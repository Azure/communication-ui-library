// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageStatus } from '@internal/acs-ui-common';
import { CommunicationParticipant } from './CommunicationParticipant';

export type MessageAttachedStatus = 'bottom' | 'top';

export type MessageContentType = 'text' | 'html' | 'richtext/html' | 'unknown';

export type ChatMessagePayload = {
  messageId?: string;
  content?: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn?: Date;
  editedOn?: Date;
  deletedOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  status?: MessageStatus;
  attached?: MessageAttachedStatus | boolean;
  mine?: boolean;
  clientMessageId?: string;
  type: MessageContentType;
};

export type SystemMessagePayloadAllProps<T extends SystemMessageType = SystemMessageType> = {
  type: T;
  messageId: string;
  createdOn: Date;
  content: T extends 'content' ? string : never;
  participants: T extends 'participantAdded'
    ? CommunicationParticipant[]
    : T extends 'participantRemoved'
    ? CommunicationParticipant[]
    : never;
  topic: T extends 'topicUpdated' ? string : never;
  iconName: string;
};

/**
 * Generate A type contains all keys as \{key: '[key-name]' | never\}, value is never when the property type is never
 */
export type AllKeys<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
};

/**
 * Omit never-typed properties from a type
 */
export type OmitNever<T> = Pick<T, AllKeys<T>[keyof AllKeys<T>]>;

// System Message payload only contains non-never properties
export type SystemMessagePayload<T extends SystemMessageType = 'content'> = OmitNever<SystemMessagePayloadAllProps<T>>;

export type CustomMessagePayload = {
  createdOn: Date;
  messageId: string;
  content?: string;
};

export type MessageType = 'chat' | 'system' | 'custom';

export type SystemMessageType = 'topicUpdated' | 'participantAdded' | 'participantRemoved' | 'content';

export type Message<T extends MessageType> = {
  type: T;
  payload: T extends 'chat'
    ? ChatMessagePayload
    : T extends 'system'
    ?
        | SystemMessagePayload<'participantAdded' | 'participantRemoved'>
        | SystemMessagePayload<'topicUpdated'>
        | SystemMessagePayload<'content'>
    : CustomMessagePayload;
};

export type ChatMessage = Message<'chat'>;
export type SystemMessage = Message<'system'>;
export type CustomMessage = Message<'custom'>;
