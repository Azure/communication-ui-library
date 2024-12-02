// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AttachmentMetadata, MessageStatus } from '@internal/acs-ui-common';
import { CommunicationParticipant } from './CommunicationParticipant';

/**
 * Indicate whether a chat message should be displayed merged with the message before / after it.
 * If `true`, the message will be appear grouped with the message before it.
 * 'top' and 'bottom' are used to indicate that the message is the start or end of a group.
 *
 * @public
 */
export type MessageAttachedStatus = 'bottom' | 'top' | boolean;

/**
 * Supported types of chat message content.
 *
 * @public
 */
export type MessageContentType = 'text' | 'html' | 'richtext/html' | 'unknown';

/**
 * Discriminated union of all messages.
 *
 * The `messageType` field specializes into union variants.
 *
 * @public
 */
export type Message =
  | ChatMessage
  | SystemMessage
  | CustomMessage
  | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;

/**
 * Discriminated union of all system messages.
 *
 * The `systemMessageType` field specializes into union variants.
 *
 * @public
 */
export type SystemMessage =
  | ParticipantAddedSystemMessage
  | ParticipantRemovedSystemMessage
  | TopicUpdatedSystemMessage
  | ContentSystemMessage;

/**
 * A chat message.
 *
 * @public
 */
export interface ChatMessage extends MessageCommon {
  messageType: 'chat';
  content?: string;
  editedOn?: Date;
  deletedOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  status?: MessageStatus;
  failureReason?: string;
  attached?: MessageAttachedStatus;
  mine?: boolean;
  clientMessageId?: string;
  contentType: MessageContentType;
  /**
   * A metadata field for the message.
   * {@link @azure/communication-chat#ChatMessage.metadata}
   */
  metadata?: Record<string, string>;
  /**
   * A list of attachments in the message.
   * {@link AttachmentMetadata}
   */
  attachments?: AttachmentMetadata[];
}

/**
 * A system message notifying that a participant was added to the chat thread.
 *
 * @public
 */
export interface ParticipantAddedSystemMessage extends SystemMessageCommon {
  systemMessageType: 'participantAdded';

  participants: CommunicationParticipant[];
}

/**
 * A system message notifying that a participant was removed from the chat thread.
 *
 * @public
 */
export interface ParticipantRemovedSystemMessage extends SystemMessageCommon {
  systemMessageType: 'participantRemoved';

  participants: CommunicationParticipant[];
}

/**
 * A system message notifying that the chat thread topic was updated.
 *
 * @public
 */
export interface TopicUpdatedSystemMessage extends SystemMessageCommon {
  systemMessageType: 'topicUpdated';

  topic: string;
}

/**
 * A system message with arbitary content.
 *
 * @public
 */
export interface ContentSystemMessage extends SystemMessageCommon {
  systemMessageType: 'content';

  content: string;
}

/* @conditional-compile-remove(data-loss-prevention) */
/**
 * Content blocked message type.
 *
 * Content blocked messages will rendered default value, but applications can provide custom strings and icon to renderers.
 *
 * @beta
 */
export interface BlockedMessage extends MessageCommon {
  messageType: 'blocked';
  warningText?: string;
  linkText?: string;
  link?: string;
  deletedOn?: Date;
  senderId?: string;
  senderDisplayName?: string;
  status?: MessageStatus;
  attached?: MessageAttachedStatus;
  mine?: boolean;
}

/**
 * A custom message type.
 *
 * Custom messages are not rendered by default, but applications can provide custom renderers for them.
 *
 * @public
 */
export interface CustomMessage extends MessageCommon {
  messageType: 'custom';

  content: string;
}

/**
 * Common properties of all system messages.
 *
 * @public
 */
export interface SystemMessageCommon extends MessageCommon {
  messageType: 'system';
  iconName: string;
}

/**
 * Common properties of all message types.
 *
 * @public
 */
export interface MessageCommon {
  messageId: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn: Date;
}
