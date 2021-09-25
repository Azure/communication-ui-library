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
 * TODO: Infer from {@link Message}.
 */
export type MessageType = 'chat' | 'system' | 'custom';

/**
 * TODO: Infer from {@link SystemMessage}.
 */
export type SystemMessageType = 'topicUpdated' | 'participantAdded' | 'participantRemoved' | 'content';

export type Message = ChatMessage | SystemMessage | CustomMessage;

export type SystemMessage =
  | ParticipantAddedSystemMessage
  | ParticipantRemovedSystemMessage
  | TopicUpdatedSystemMessage
  | ContentSystemMessage;

/**
 * {@link Message} content, specialized for chat messages.
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
  attached?: MessageAttachedStatus | boolean;
  mine?: boolean;
  clientMessageId?: string;
  contentType: MessageContentType;
}

export interface ParticipantAddedSystemMessage extends SystemMessageCommon {
  messageType: 'system';
  systemMessageType: 'participantAdded';

  participants: CommunicationParticipant[];
}

export interface ParticipantRemovedSystemMessage extends SystemMessageCommon {
  messageType: 'system';
  systemMessageType: 'participantRemoved';

  participants: CommunicationParticipant[];
}

export interface TopicUpdatedSystemMessage extends SystemMessageCommon {
  messageType: 'system';
  systemMessageType: 'topicUpdated';

  topic: string;
}

export interface ContentSystemMessage extends SystemMessageCommon {
  messageType: 'system';
  systemMessageType: 'content';

  content: string;
}

export interface CustomMessage extends MessageCommon {
  messageType: 'custom';

  content: string;
}

export interface SystemMessageCommon extends MessageCommon {
  iconName: string;
}

export interface MessageCommon {
  messageId: string;
  // ISO8601 format: `yyyy-MM-ddTHH:mm:ssZ`
  createdOn: Date;
}
