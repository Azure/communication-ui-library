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
   * FIXME(Documentation)
   */
  errors: ChatErrors;
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
 * Each property in the object stores the errors for a particular SDK API method.
 * For each method, errors are appended as they occur.
 *
 * Errors from this object can be cleared by calling the TODO(implement me) {@Link clearErrors} method.
 * Additionally, errors are automatically cleared when:
 * - The state is cleared.
 * - The corresponding API method or a related method succeeds on subsequent attempts.
 *   See documentation of individual stateful client methods for details on when errors may be automatically cleared.
 */
export type ChatErrors = {
  [target in ChatErrorTargets]: Error[];
};

/**
 * String literal type for all permissible keys in {@Link ChatErrors}.
 */
export type ChatErrorTargets =
  | ChatObjectMethodNames<'ChatClient', ChatClient>
  | ChatObjectMethodNames<'ChatThreadClient', ChatThreadClient>;

/**
 * Helper type to build a string literal type containing methods of an object.
 */
export type ChatObjectMethodNames<TName extends string, T> = {
  [K in keyof T]: `${TName}.${ChatMethodName<T, K>}`;
}[keyof T];

/**
 * Helper type to build a string literal type containing methods of an object.
 */
// eslint complains on all uses of `Function`. Using it as a type constraint is legitimate.
// eslint-disable-next-line @typescript-eslint/ban-types
export type ChatMethodName<T, K extends keyof T> = T[K] extends Function ? (K extends string ? K : never) : never;

/**
 * Method to decide at runtime if a string is an error target.
 */
export const isChatErrorTarget = (target: string): boolean => {
  for (const targetPrefix in ChatErrorTargetPrefixes) {
    const [prefix, obj] = targetPrefix;
    if (target.startsWith(prefix)) {
      target = target.substring(prefix.length);
      if (obj[target] !== undefined && typeof obj[target] === 'function') {
        return true;
      }
    }
  }
  return false;
};

const ChatErrorTargetPrefixes = [
  ['ChatClient.', ChatClient],
  ['ChatThreadClient.', ChatThreadClient]
];
