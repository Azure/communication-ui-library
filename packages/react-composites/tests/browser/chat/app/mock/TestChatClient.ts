// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { TestChatParticipant } from './TestChatParticipant';

/** @private */
export interface TestChatClient {
  onStateChange(handler: (state: ChatThreadClientState) => void): void;
  offStateChange(handler: (state: ChatThreadClientState) => void): void;
  getChatThreadState(): ChatThreadClientState;
  fetchInitialData: () => Promise<void>;
  sendMessage(sender: TestChatParticipant, messageContent: string): Promise<void>;
  sendReadReceipt(sender: TestChatParticipant, chatMessageId: string): Promise<void>;
  sendTypingIndicator(sender: TestChatParticipant): Promise<void>;
  removeParticipant(participantId: string): Promise<void>;
  setTopic(topicName: string): Promise<void>;
  updateMessage(messageId: string, content: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
  loadPreviousChatMessages(messagesToLoad: number): Promise<boolean>;
}
