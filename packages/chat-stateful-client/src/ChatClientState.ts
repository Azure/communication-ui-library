// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessageReadReceipt, ChatParticipant } from '@azure/communication-chat';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';

export type ChatClientState = {
  userId: CommunicationIdentifierKind;
  displayName: string;
  /**
   * Chat threads joined by the current user.
   * Object with {@link ChatThreadClientState} fields, keyed by {@link ChatThreadClientState.threadId}.
   */
  threads: { [key: string]: ChatThreadClientState };
  /**
   * Stores the latest error for each API method.
   *
   * See documentation of {@link ChatErrors} for details.
   */
  latestErrors: ChatErrors;
};

export type ChatThreadClientState = {
  /**
   * Messages in this thread.
   * Object with {@link ChatMessageWithStatus} entries
   * Local messages are keyed by keyed by {@link ChatMessageWithStatus.clientMessageId}.
   * Remote messages are keyed by {@link @azure/communication-chat#ChatMessage.id}.
   */
  chatMessages: { [key: string]: ChatMessageWithStatus };
  /**
   * Participants of this chat thread.
   *
   * Object with {@link @azure/communication-chat#ChatParticipant} fields,
   * keyed by {@link @azure/communication-chat#ChatParticipant.id}.
   */
  participants: { [key: string]: ChatParticipant };
  threadId: string;
  properties?: ChatThreadProperties;
  readReceipts: ChatMessageReadReceipt[];
  typingIndicators: TypingIndicatorReceivedEvent[];
  latestReadTime: Date;
};

// @azure/communication-chat exports two interfaces for this concept,
// and @azure/communication-signaling exports one.
// In the absence of a common interface for this concept, we define a minimal one
// that helps us hide the different types used by underlying API.
export type ChatThreadProperties = {
  topic?: string;
};

/**
 * Errors teed from API calls to the Chat SDK.
 *
 * Each property in the object stores the latest error for a particular SDK API method.
 *
 * Errors from this object can be cleared by calling the TODO(implement me) {@link clearError} method.
 * Additionally, errors are automatically cleared when:
 * - The state is cleared.
 * - Subsequent calls to related API methods succeed.
 * See documentation of individual stateful client methods for details on when errors may be automatically cleared.
 */
export type ChatErrors = {
  [target in ChatErrorTarget]: Error;
};

/**
 * Error thrown from failed stateful API methods.
 */
export class ChatError extends Error {
  /**
   * The API method target that failed.
   */
  public target: ChatErrorTarget;
  /**
   * Error thrown by the failed SDK method.
   */
  public inner: Error;

  constructor(target: ChatErrorTarget, inner: Error) {
    super();
    this.target = target;
    this.inner = inner;
    this.name = 'ChatError';
    this.message = `${this.target}: ${this.inner.message}`;
  }
}

/**
 * String literal type for all permissible keys in {@link ChatErrors}.
 */
export type ChatErrorTarget =
  | 'ChatClient.createChatThread'
  | 'ChatClient.deleteChatThread'
  | 'ChatClient.getChatThreadClient'
  | 'ChatClient.listChatThreads'
  | 'ChatClient.off'
  | 'ChatClient.on'
  | 'ChatClient.startRealtimeNotifications'
  | 'ChatClient.stopRealtimeNotifications'
  | 'ChatThreadClient.addParticipants'
  | 'ChatThreadClient.deleteMessage'
  | 'ChatThreadClient.getMessage'
  | 'ChatThreadClient.getProperties'
  | 'ChatThreadClient.listMessages'
  | 'ChatThreadClient.listParticipants'
  | 'ChatThreadClient.listReadReceipts'
  | 'ChatThreadClient.removeParticipant'
  | 'ChatThreadClient.sendMessage'
  | 'ChatThreadClient.sendReadReceipt'
  | 'ChatThreadClient.sendTypingNotification'
  | 'ChatThreadClient.updateMessage'
  | 'ChatThreadClient.updateTopic';
