// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageStatus } from '@internal/acs-ui-common';
import { CommunicationParticipant } from './CommunicationParticipant';

/**
 * Indicate whether a chat message should be displayed merged with the message before / after it.
 *
 * Useful to merge many messages from the same sender into a single message bubble.
 *
 * @public
 */
export type MessageAttachedStatus = 'bottom' | 'top';

/**
 * Supported types of chat message content.
 *
 * @public
 */
export type MessageContentType = 'text' | 'html' | 'richtext/html' | 'unknown';

/**
 * Content of a single chat message.
 *
 * @public
 */
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

/**
 * Utility type to extract all props of a system message.
 *
 * @public
 */
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
 * Type that contains all keys from the source type as \{key: '[key-name]' | never\}.
 *
 * Value is `never` when the property type is `never`.
 *
 * @public
 */
export type AllKeys<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
};

/**
 * Omit never-typed properties from a type.
 *
 * @public
 */
export type OmitNever<T> = Pick<T, AllKeys<T>[keyof AllKeys<T>]>;

/**
 * Contents of system messages.
 *
 * Only contains non-never properties.
 *
 * @public
 */
export type SystemMessagePayload<T extends SystemMessageType = 'content'> = OmitNever<SystemMessagePayloadAllProps<T>>;

/**
 * Contents of custome messages.
 *
 * @public
 */
export type CustomMessagePayload = {
  createdOn: Date;
  messageId: string;
  content?: string;
};

/**
 * Supported message types.
 *
 * @public
 */
export type MessageType = 'chat' | 'system' | 'custom';

/**
 * Supported system message types.
 *
 * @public
 */
export type SystemMessageType = 'topicUpdated' | 'participantAdded' | 'participantRemoved' | 'content';

/**
 * Tagged union of specific {@link MessageType} contents.
 *
 * @public
 */
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

/**
 * {@link Message} content, specialized for chat messages.
 *
 * @public
 */
export type ChatMessage = Message<'chat'>;
/**
 * {@link Message} content, specialized for system messages.
 *
 * @public
 */
export type SystemMessage = Message<'system'>;
/**
 * {@link Message} content, specialized for custom messages.
 *
 * @public
 */
export type CustomMessage = Message<'custom'>;
