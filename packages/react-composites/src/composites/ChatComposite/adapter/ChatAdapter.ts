// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClientState } from 'chat-stateful-client';
import type { ChatMessage, ChatParticipant, SendChatMessageResult } from '@azure/communication-chat';
import type { CommunicationUserKind } from '@azure/communication-common';

export type ChatUIState = {
  // Self-contained state for composite
  error?: Error;
};

export type ChatCompositeClientState = {
  // Properties from backend services
  userId: string;
  displayName: string;
  thread: ChatThreadClientState;
};

export type ChatState = ChatUIState & ChatCompositeClientState;

export interface ChatAdapter {
  onStateChange(handler: (state: ChatState) => void): void;
  offStateChange(handler: (state: ChatState) => void): void;
  getState(): ChatState;
  dispose(): void;
  /*
   * Fetch initial state for the Chat adapter.
   *
   * Performs the minimal fetch necessary for ChatComposite and API methods.
   */
  fetchInitialData(): Promise<void>;
  sendMessage(content: string): Promise<SendChatMessageResult>;
  sendReadReceipt(chatMessageId: string): Promise<void>;
  sendTypingIndicator(): Promise<void>;
  removeParticipant(userId: string): Promise<void>;
  setTopic(topicName: string): Promise<void>;
  loadPreviousChatMessages(messagesToLoad: number): Promise<boolean>;
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageSentListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'topicChanged', listener: TopicChangedListener): void;
  on(event: 'error', listener: (e: Error) => void): void;

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageSentListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'topicChanged', listener: TopicChangedListener): void;
  off(event: 'error', listener: (e: Error) => void): void;
}

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
export type TopicChangedListener = (event: { topic: string }) => void;
export type ChatEvent =
  | 'messageReceived'
  | 'messageSent'
  | 'messageRead'
  | 'participantsAdded'
  | 'participantsRemoved'
  | 'topicChanged'
  | 'error';
