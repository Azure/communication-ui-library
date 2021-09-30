// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClientState } from '@internal/chat-stateful-client';
import type { ChatMessage, ChatParticipant } from '@azure/communication-chat';
import type { CommunicationUserKind } from '@azure/communication-common';
import type { AdapterState, Disposal, AdapterErrors, AdapterError } from '../../common/adapters';

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
  // Properties from backend services
  userId: string;
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
  /*
   * Fetch initial state for the Chat adapter.
   *
   * Performs the minimal fetch necessary for ChatComposite and API methods.
   */
  fetchInitialData(): Promise<void>;
  sendMessage(content: string): Promise<void>;
  sendReadReceipt(chatMessageId: string): Promise<void>;
  sendTypingIndicator(): Promise<void>;
  removeParticipant(userId: string): Promise<void>;
  setTopic(topicName: string): Promise<void>;
  updateMessage(messageId: string, content: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
  loadPreviousChatMessages(messagesToLoad: number): Promise<boolean>;
}

/**
 * Chat composite events that can be subscribed to.
 *
 * @public
 */
export interface ChatAdapterSubscribers {
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageSentListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'topicChanged', listener: TopicChangedListener): void;
  on(event: 'error', listener: (e: AdapterError) => void): void;

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageSentListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'topicChanged', listener: TopicChangedListener): void;
  off(event: 'error', listener: (e: AdapterError) => void): void;
}

/**
 * {@link ChatComposite} Adapter interface.
 *
 * @public
 */
export interface ChatAdapter
  extends ChatAdapterThreadManagement,
    AdapterState<ChatAdapterState>,
    Disposal,
    ChatAdapterSubscribers {}

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
