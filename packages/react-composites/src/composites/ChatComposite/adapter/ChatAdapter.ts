// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ChatMessage, ChatParticipant, SendMessageOptions } from '@azure/communication-chat';
import type { CommunicationIdentifierKind, CommunicationUserKind } from '@azure/communication-common';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import type { AdapterError, AdapterErrors, AdapterState, Disposable } from '../../common/adapters';
/* @conditional-compile-remove(file-sharing) */
import { FileUploadAdapter, FileUploadsUiState } from './AzureCommunicationFileUploadAdapter';
/* @conditional-compile-remove(teams-inline-images) */
import { AttachmentDownloadResult } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing) */ /* @conditional-compile-remove(teams-inline-images) */
import { FileMetadata } from '@internal/react-components';

/**
 * {@link ChatAdapter} state for pure UI purposes.
 *
 * @public
 */
export type ChatAdapterUiState = {
  // FIXME(Delete?)
  // Self-contained state for composite
  error?: Error;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Files being uploaded by a user in the current thread.
   * Should be set to null once the upload is complete.
   * Array of type {@link FileUploadsUiState}
   * @beta
   */
  fileUploads?: FileUploadsUiState;
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
   */
  sendMessage(content: string, options?: SendMessageOptions): Promise<void>;
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
   */
  updateMessage(
    messageId: string,
    content: string,
    metadata?: Record<string, string>,
    /* @conditional-compile-remove(file-sharing) */
    options?: {
      attachedFilesMetadata?: FileMetadata[];
    }
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
  /* @conditional-compile-remove(teams-inline-images) */
  downloadAuthenticatedAttachment: (attachmentUrl: string) => Promise<AttachmentDownloadResult>;
}

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
  ChatAdapterSubscribers &
  /* @conditional-compile-remove(file-sharing) */
  FileUploadAdapter;

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
