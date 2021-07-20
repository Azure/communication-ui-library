// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatMessageReadReceipt, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { TypingIndicatorReceivedEvent } from '@azure/communication-signaling';

export type ChatClientState = {
  userId: CommunicationIdentifierKind;
  displayName: string;
  /**
   * Chat threads joined by the current user.
   * Object with {@Link ChatThreadClientState} fields, keyed by {@Link ChatThreadClientState.threadId}.
   */
  threads: { [key: string]: ChatThreadClientState };
  /**
   * Stores the latest error for each API method.
   *
   * See documentation of {@Link ChatErrors} for details.
   */
  latestErrors: ChatErrors;
};

export type ChatThreadClientState = {
  /**
   * Messages in this thread.
   * Object with {@Link ChatMessageWithStatus} entries
   * Local messages are keyed by keyed by {@Link ChatMessageWithStatus.clientMessageId}.
   * Remote messages are keyed by {@Link @azure/communication-chat#ChatMessage.id}.
   */
  chatMessages: { [key: string]: ChatMessageWithStatus };
  /**
   * Participants of this chat thread.
   *
   * Object with {@Link @azure/communication-chat#ChatParticipant} fields,
   * keyed by {@Link @azure/communication-chat#ChatParticipant.id}.
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
 * Errors from this object can be cleared by calling the TODO(implement me) {@Link clearError} method.
 * Additionally, errors are automatically cleared when:
 * - The state is cleared.
 * - Subsequent calls to related API methods succeed.
 * See documentation of individual stateful client methods for details on when errors may be automatically cleared.
 */
export type ChatErrors = {
  [target in ChatErrorTargets]: Error;
};

/**
 * Error thrown from failed stateful API methods.
 */
export class ChatError extends Error {
  /**
   * The API method target that failed.
   */
  public target: ChatErrorTargets;
  /**
   * Error thrown by the failed SDK method.
   */
  public inner: Error;

  constructor(target: ChatErrorTargets, inner: Error) {
    super();
    this.target = target;
    this.inner = inner;
    this.name = 'ChatError';
    this.message = `${this.target}: ${this.inner.message}`;
  }
}

/**
 * String literal type for all permissible keys in {@Link ChatErrors}.
 */
export type ChatErrorTargets = ChatClientErrorTargets | ChatThreadClientErrorTargets;

type ChatClientErrorTargets = ChatObjectMethodNames<'ChatClient', ChatClient>;
type ChatThreadClientErrorTargets = ChatObjectMethodNames<'ChatThreadClient', ChatThreadClient>;
/**
 * Helper type to build a string literal type containing methods of an object.
 */
export type ChatObjectMethodNames<TName extends string, T> = {
  [K in keyof T & string]: `${TName}.${ChatMethodName<T, K>}`;
}[keyof T & string];

/**
 * Helper type to build a string literal type containing methods of an object.
 */
export type ChatMethodName<T, K extends keyof T & string> = T[K] extends (...args: any[]) => void ? K : never;
