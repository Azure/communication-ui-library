// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClientState } from '@internal/chat-stateful-client';
import type { ChatMessage, ChatParticipant } from '@azure/communication-chat';
import type { CommunicationUserKind } from '@azure/communication-common';
import type { AdapterState, AdapterDisposal, AdapterErrorHandlers } from '../../common/adapters';

export type ChatAdapterUiState = {
  // FIXME(Delete?)
  // Self-contained state for composite
  error?: Error;
};

export type ChatCompositeClientState = {
  // Properties from backend services
  userId: string;
  displayName: string;
  thread: ChatThreadClientState;
  /**
   * Latest error encountered for each operation performed via the adapter.
   */
  latestErrors: ChatAdapterErrors;
};

/**
 * ChatAdapter stores the latest error for each operation in the state.
 *
 * `operation` is a ChatAdapter defined string for each unique operation performed by the adapter.
 */
export type ChatAdapterErrors = { [operation: string]: Error };

export type ChatAdapterState = ChatAdapterUiState & ChatCompositeClientState;

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
  loadPreviousChatMessages(messagesToLoad: number): Promise<boolean>;
}

export interface ChatAdapterSubscribers {
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageSentListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'topicChanged', listener: TopicChangedListener): void;
  on(event: 'error', listener: ChatErrorListener): void;

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageSentListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'topicChanged', listener: TopicChangedListener): void;
  off(event: 'error', listener: ChatErrorListener): void;
}

export interface ChatAdapter
  extends ChatAdapterThreadManagement,
    AdapterState<ChatAdapterState>,
    AdapterDisposal,
    AdapterErrorHandlers,
    ChatAdapterSubscribers {}

export type MessageReceivedListener = (event: { message: ChatMessage }) => void;
export type MessageSentListener = MessageReceivedListener;
export type MessageReadListener = (event: { message: ChatMessage; readBy: CommunicationUserKind }) => void;
export type ParticipantsAddedListener = (event: {
  participantsAdded: ChatParticipant[];
  addedBy: ChatParticipant;
}) => void;
export type ParticipantsRemovedListener = (event: {
  participantsRemoved: ChatParticipant[];
  removedBy: ChatParticipant;
}) => void;
/**
 * Listener for error events.
 *
 * Each failed operation in the {@link ChatAdapter} triggers an 'error' event.
 * `operation` is a {@link ChatAdapter} defined string for each unique operation performed
 * by the adapter.
 */
export type ChatErrorListener = (event: { operation: string; error: Error }) => void;
export type TopicChangedListener = (event: { topic: string }) => void;
export type ChatEvent =
  | 'messageReceived'
  | 'messageSent'
  | 'messageRead'
  | 'participantsAdded'
  | 'participantsRemoved'
  | 'topicChanged'
  | 'error';
