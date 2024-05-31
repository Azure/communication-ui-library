// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { ChatMessage, ChatParticipant, SendMessageOptions } from '@azure/communication-chat';
import type { CommunicationIdentifierKind, CommunicationUserKind } from '@azure/communication-common';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import type { AdapterError, AdapterErrors, AdapterState, Disposable } from '../../common/adapters';
/* @conditional-compile-remove(attachment-upload) */
import { MessageOptions } from '@internal/acs-ui-common';

/**
 * {@link ChatAdapter} state for pure UI purposes.
 *
 * @public
 */
export type ChatAdapterUiState = {
  // FIXME(Delete?)
  // Self-contained state for composite
  error?: Error;
};

/**
 * {@link ChatAdapter} state inferred from Azure Communication Services backend.
 *
 * @public
 */
export type ChatCompositeClientState = {
  userId: CommunicationIdentifierKind;
  displayName: string;
  thread: ChatThreadClientState;
  /**
   * Latest error encountered for each operation performed via the adapter.
   */
  latestErrors: AdapterErrors;
};

/**
 * {@link ChatAdapter} state.
 *
 * @public
 */
export type ChatAdapterState = ChatAdapterUiState & ChatCompositeClientState;

/**
 * Functionality for managing the current chat thread.
 *
 * @public
 */
export interface ChatAdapterThreadManagement {
  /**
   * Fetch initial state for the Chat adapter.
   *
   * Performs the minimal fetch necessary for ChatComposite and API methods.
   */
  fetchInitialData(): Promise<void>;
  /**
   * Send a message in the thread.
   * Please note that SendMessageOptions is being deprecated, please use MessageOptions instead.
   */
  sendMessage(
    content: string,
    options?: SendMessageOptions | /* @conditional-compile-remove(attachment-upload) */ MessageOptions
  ): Promise<void>;
  /**
   * Send a read receipt for a message.
   */
  sendReadReceipt(chatMessageId: string): Promise<void>;
  /**
   * Send typing indicator in the thread.
   */
  sendTypingIndicator(): Promise<void>;
  /**
   * Remove a participant in the thread.
   */
  removeParticipant(userId: string): Promise<void>;
  /**
   * Set the topic for the thread.
   */
  setTopic(topicName: string): Promise<void>;
  /**
   * Update a message content.
   * Please note that metadata is being deprecated, please use MessageOptions.metadata instead.
   */
  updateMessage(
    messageId: string,
    content: string,
    options?: Record<string, string> | /* @conditional-compile-remove(attachment-upload) */ MessageOptions
  ): Promise<void>;
  /**
   * Delete a message in the thread.
   */
  deleteMessage(messageId: string): Promise<void>;
  /**
   * Load more previous messages in the chat thread history.
   *
   * @remarks
   * This method is usually used to control incremental fetch/infinite scroll
   *
   */
  loadPreviousChatMessages(messagesToLoad: number): Promise<boolean>;
  /**
   * Downloads a resource into the cache for the given message.
   */
  downloadResourceToCache(resourceDetails: ResourceDetails): Promise<void>;
  /**
   * Removes a resource from the cache for the given message.
   */
  removeResourceFromCache(resourceDetails: ResourceDetails): void;
}
/**
 * Details required for download a resource to cache.
 *
 * @public
 */
export type ResourceDetails = {
  threadId: string;
  messageId: string;
  resourceUrl: string;
};

/**
 * Chat composite events that can be subscribed to.
 *
 * @public
 */
export interface ChatAdapterSubscribers {
  /**
   * Subscribe function for 'messageReceived' event.
   */
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  /**
   * Subscribe function for 'messageEdited' event.
   */
  on(event: 'messageEdited', listener: MessageEditedListener): void;
  /**
   * Subscribe function for 'messageDeleted' event.
   */
  on(event: 'messageDeleted', listener: MessageDeletedListener): void;
  /**
   * Subscribe function for 'messageSent' event.
   */
  on(event: 'messageSent', listener: MessageSentListener): void;
  /**
   * Subscribe function for 'messageRead' event.
   */
  on(event: 'messageRead', listener: MessageReadListener): void;
  /**
   * Subscribe function for 'participantsAdded' event.
   */
  on(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  /**
   * Subscribe function for 'participantsRemoved' event.
   */
  on(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  /**
   * Subscribe function for 'topicChanged' event.
   */
  on(event: 'topicChanged', listener: TopicChangedListener): void;
  /**
   * Subscribe function for 'error' event.
   */
  on(event: 'error', listener: (e: AdapterError) => void): void;

  /**
   * Unsubscribe function for 'messageReceived' event.
   */
  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  /**
   * Unsubscribe function for 'messageEdited' event.
   */
  off(event: 'messageEdited', listener: MessageEditedListener): void;
  /**
   * Unsubscribe function for 'messageDeleted' event.
   */
  off(event: 'messageDeleted', listener: MessageDeletedListener): void;
  /**
   * Unsubscribe function for 'messageSent' event.
   */
  off(event: 'messageSent', listener: MessageSentListener): void;
  /**
   * Unsubscribe function for 'messageRead' event.
   */
  off(event: 'messageRead', listener: MessageReadListener): void;
  /**
   * Unsubscribe function for 'participantsAdded' event.
   */
  off(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  /**
   * Unsubscribe function for 'participantsRemoved' event.
   */
  off(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  /**
   * Unsubscribe function for 'topicChanged' event.
   */
  off(event: 'topicChanged', listener: TopicChangedListener): void;
  /**
   * Unsubscribe function for 'error' event.
   */
  off(event: 'error', listener: (e: AdapterError) => void): void;
}

/**
 * {@link ChatComposite} Adapter interface.
 *
 * @public
 */
export type ChatAdapter = ChatAdapterThreadManagement &
  AdapterState<ChatAdapterState> &
  Disposable &
  ChatAdapterSubscribers;

/**
 * Callback for {@link ChatAdapterSubscribers} 'messageReceived' event.
 *
 * @public
 */
export type MessageReceivedListener = (event: { message: ChatMessage }) => void;

/**
 * Callback for {@link ChatAdapterSubscribers} 'messageSent' event.
 *
 * @public
 */
export type MessageSentListener = MessageReceivedListener;

/**
 * Callback for {@link ChatAdapterSubscribers} 'messageEdited' event.
 *
 * @public
 */
export type MessageEditedListener = MessageReceivedListener;

/**
 * Callback for {@link ChatAdapterSubscribers} 'messageDeleted' event.
 *
 * @public
 */
export type MessageDeletedListener = MessageReceivedListener;

/**
 * Callback for {@link ChatAdapterSubscribers} 'messageRead' event.
 *
 * @public
 */
export type MessageReadListener = (event: { message: ChatMessage; readBy: CommunicationUserKind }) => void;

/**
 * Callback for {@link ChatAdapterSubscribers} 'participantsAdded' event.
 *
 * @public
 */
export type ParticipantsAddedListener = (event: {
  participantsAdded: ChatParticipant[];
  addedBy: ChatParticipant;
}) => void;

/**
 * Callback for {@link ChatAdapterSubscribers} 'participantsRemoved' event.
 *
 * @public
 */
export type ParticipantsRemovedListener = (event: {
  participantsRemoved: ChatParticipant[];
  removedBy: ChatParticipant;
}) => void;

/**
 * Callback for {@link ChatAdapterSubscribers} 'topicChanged' event.
 *
 * @public
 */
export type TopicChangedListener = (event: { topic: string }) => void;
