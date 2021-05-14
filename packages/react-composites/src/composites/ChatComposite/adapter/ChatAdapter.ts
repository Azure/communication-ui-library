// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClientState } from 'chat-stateful-client';
import { ChatMessage, ChatParticipant } from '@azure/communication-chat';

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
  sendMessage(content: string): Promise<void>;
  sendReadReceipt(chatMessageId: string): Promise<void>;
  sendTypingIndicator(): Promise<void>;
  removeParticipant(userId: string): Promise<void>;
  setTopic(topicName: string): Promise<void>;
  loadPreviousChatMessages(messagesToLoad: number): Promise<boolean>;
  updateAllParticipants(): Promise<void>;
  on(event: 'messageReceived', messageReceivedHandler: (message: ChatMessage) => void): void;
  on(event: 'participantsJoined', participantsJoinedHandler: (participant: ChatParticipant) => void): void;
  on(event: 'error', errorHandler: (e: Error) => void): void;
}

export type ChatEvent = 'messageReceived' | 'participantsJoined' | 'error';
