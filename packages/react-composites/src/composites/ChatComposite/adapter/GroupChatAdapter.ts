// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClientState } from 'chat-stateful-client';
import { ChatMessage, ChatParticipant } from '@azure/communication-chat';

export type GroupChatUIState = {
  // Self-contained state for composite
  error?: Error;
};

export type GroupChatClientState = {
  // Properties from backend services
  userId: string;
  displayName: string;
  thread: ChatThreadClientState;
};

export type GroupChatState = GroupChatUIState & GroupChatClientState;

export interface GroupChatAdapter {
  onStateChange(handler: (state: GroupChatState) => void): void;
  offStateChange(handler: (state: GroupChatState) => void): void;
  getState(): GroupChatState;
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

export type GroupChatEvent = 'messageReceived' | 'participantsJoined' | 'error';
