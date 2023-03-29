// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  createStatefulChatClient,
  ChatClientState,
  ChatError,
  StatefulChatClient
} from '@internal/chat-stateful-client';
import { ChatHandlers, createDefaultChatHandlers } from '@internal/chat-component-bindings';
import { ChatMessage, ChatMessageType, ChatThreadClient, SendMessageOptions } from '@azure/communication-chat';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import type {
  ChatMessageReceivedEvent,
  ChatThreadPropertiesUpdatedEvent,
  ParticipantsAddedEvent,
  ParticipantsRemovedEvent,
  ReadReceiptReceivedEvent
} from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import EventEmitter from 'events';
import {
  ChatAdapter,
  ChatAdapterState,
  MessageReadListener,
  MessageReceivedListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener,
  TopicChangedListener
} from './ChatAdapter';
import { AdapterError } from '../../common/adapters';
/* @conditional-compile-remove(file-sharing) */
import {
  FileUploadAdapter,
  AzureCommunicationFileUploadAdapter,
  convertFileUploadsUiStateToMessageMetadata
} from './AzureCommunicationFileUploadAdapter';
import { useEffect, useRef, useState } from 'react';
import { FileMetadata } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing) */
import { FileUploadManager } from '../file-sharing';
import { isValidIdentifier } from '../../CallComposite/utils/Utils';

/**
 * Context of Chat, which is a centralized context for all state updates
 * @private
 */
export class ChatContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: ChatAdapterState;
  private threadId: string;

  constructor(clientState: ChatClientState, threadId: string) {
    const thread = clientState.threads[threadId];
    this.threadId = threadId;
    if (!thread) {
      throw 'Cannot find threadId, please initialize thread before use!';
    }
    this.state = {
      userId: clientState.userId,
      displayName: clientState.displayName,
      thread,
      latestErrors: clientState.latestErrors
    };
  }

  public onStateChange(handler: (_uiState: ChatAdapterState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: ChatAdapterState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: ChatAdapterState): void {
    this.state = state;
    this.emitter.emit('stateChanged', this.state);
  }

  public getState(): ChatAdapterState {
    return this.state;
  }

  public setError(error: Error): void {
    this.setState({ ...this.state, error });
  }

  public updateClientState(clientState: ChatClientState): void {
    const thread = clientState.threads[this.threadId];
    if (!thread) {
      throw 'Cannot find threadId, please make sure thread state is still in Stateful ChatClient.';
    }

    let updatedState: ChatAdapterState = {
      userId: clientState.userId,
      displayName: clientState.displayName,
      thread,
      latestErrors: clientState.latestErrors
    };

    /* @conditional-compile-remove(file-sharing) */
    updatedState = { ...updatedState, fileUploads: this.state.fileUploads };

    this.setState(updatedState);
  }
}

/**
 * @private
 */
export class AzureCommunicationChatAdapter implements ChatAdapter {
  private chatClient: StatefulChatClient;
  private chatThreadClient: ChatThreadClient;
  private context: ChatContext;
  /* @conditional-compile-remove(file-sharing) */ /* @conditional-compile-remove(teams-inline-images) */
  private fileUploadAdapter: FileUploadAdapter;
  private handlers: ChatHandlers;
  private emitter: EventEmitter = new EventEmitter();

  constructor(chatClient: StatefulChatClient, chatThreadClient: ChatThreadClient, options?: ChatAdapterOptions) {
    this.bindAllPublicMethods();
    this.chatClient = chatClient;
    this.chatThreadClient = chatThreadClient;
    this.context = new ChatContext(chatClient.getState(), chatThreadClient.threadId);
    /* @conditional-compile-remove(file-sharing) */
    this.fileUploadAdapter = new AzureCommunicationFileUploadAdapter(this.context, options?.credential);
    const onStateChange = (clientState: ChatClientState): void => {
      // unsubscribe when the instance gets disposed
      if (!this) {
        chatClient.offStateChange(onStateChange);
        return;
      }
      this.context.updateClientState(clientState);
    };

    this.handlers = createDefaultChatHandlers(chatClient, chatThreadClient);

    this.chatClient.onStateChange(onStateChange);
    this.subscribeAllEvents();
  }

  private bindAllPublicMethods(): void {
    this.onStateChange = this.onStateChange.bind(this);
    this.offStateChange = this.offStateChange.bind(this);
    this.getState = this.getState.bind(this);
    this.dispose = this.dispose.bind(this);
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendReadReceipt = this.sendReadReceipt.bind(this);
    this.sendTypingIndicator = this.sendTypingIndicator.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.setTopic = this.setTopic.bind(this);
    this.loadPreviousChatMessages = this.loadPreviousChatMessages.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    /* @conditional-compile-remove(file-sharing) */
    this.registerActiveFileUploads = this.registerActiveFileUploads.bind(this);
    /* @conditional-compile-remove(file-sharing) */
    this.registerCompletedFileUploads = this.registerCompletedFileUploads.bind(this);
    /* @conditional-compile-remove(file-sharing) */
    this.clearFileUploads = this.clearFileUploads.bind(this);
    /* @conditional-compile-remove(file-sharing) */
    this.cancelFileUpload = this.cancelFileUpload.bind(this);
    /* @conditional-compile-remove(file-sharing) */
    this.updateFileUploadProgress = this.updateFileUploadProgress.bind(this);
    /* @conditional-compile-remove(file-sharing) */
    this.updateFileUploadErrorMessage = this.updateFileUploadErrorMessage.bind(this);
    /* @conditional-compile-remove(file-sharing) */
    this.updateFileUploadMetadata = this.updateFileUploadMetadata.bind(this);
    /* @conditional-compile-remove(teams-inline-images) */
    this.downloadAuthenticatedAttachment = this.downloadAuthenticatedAttachment.bind(this);
  }

  dispose(): void {
    this.unsubscribeAllEvents();
  }

  async fetchInitialData(): Promise<void> {
    // If get properties fails we dont want to try to get the participants after.
    await this.asyncTeeErrorToEventEmitter(async () => {
      await this.chatThreadClient.getProperties();
      // Fetch all participants who joined before the local user.
      for await (const _page of this.chatThreadClient.listParticipants().byPage({
        // Fetch 100 participants per page by default.
        maxPageSize: 100
        // eslint-disable-next-line curly
      }));
    });
  }

  getState(): ChatAdapterState {
    return this.context.getState();
  }

  onStateChange(handler: (state: ChatAdapterState) => void): void {
    this.context.onStateChange(handler);
  }

  offStateChange(handler: (state: ChatAdapterState) => void): void {
    this.context.offStateChange(handler);
  }

  async sendMessage(content: string, options: SendMessageOptions = {}): Promise<void> {
    await this.asyncTeeErrorToEventEmitter(async () => {
      /* @conditional-compile-remove(file-sharing) */
      options.metadata = {
        ...options.metadata,
        ...convertFileUploadsUiStateToMessageMetadata(this.context.getState().fileUploads)
      };

      /* @conditional-compile-remove(file-sharing) */
      /**
       * All the current uploads need to be clear from the state before a message has been sent.
       * This ensures the following behavior:
       * 1. File Upload cards are removed from sendbox at the same time text in sendbox is removed.
       * 2. any component rendering these file uploads doesn't continue to do so.
       * 3. Cleans the state for new file uploads with a fresh message.
       */
      this.fileUploadAdapter.clearFileUploads();

      await this.handlers.onSendMessage(content, options);
    });
  }

  async sendReadReceipt(chatMessageId: string): Promise<void> {
    await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onMessageSeen(chatMessageId);
    });
  }

  async sendTypingIndicator(): Promise<void> {
    await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onTyping();
    });
  }

  async removeParticipant(userId: string): Promise<void> {
    await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onRemoveParticipant(userId);
    });
  }

  async setTopic(topicName: string): Promise<void> {
    await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.updateThreadTopicName(topicName);
    });
  }

  async loadPreviousChatMessages(messagesToLoad: number): Promise<boolean> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      return await this.handlers.onLoadPreviousChatMessages(messagesToLoad);
    });
  }

  async updateMessage(
    messageId: string,
    content: string,
    metadata?: Record<string, string>,
    options?: {
      attachedFilesMetadata?: FileMetadata[];
    }
  ): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      /* @conditional-compile-remove(file-sharing) */
      return await this.handlers.onUpdateMessage(messageId, content, metadata, options);
      return await this.handlers.onUpdateMessage(messageId, content);
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      return await this.handlers.onDeleteMessage(messageId);
    });
  }

  /* @conditional-compile-remove(file-sharing) */
  registerActiveFileUploads(files: File[]): FileUploadManager[] {
    return this.fileUploadAdapter.registerActiveFileUploads(files);
  }

  /* @conditional-compile-remove(file-sharing) */
  registerCompletedFileUploads(metadata: FileMetadata[]): FileUploadManager[] {
    return this.fileUploadAdapter.registerCompletedFileUploads(metadata);
  }

  /* @conditional-compile-remove(file-sharing) */
  clearFileUploads(): void {
    this.fileUploadAdapter.clearFileUploads();
  }

  /* @conditional-compile-remove(file-sharing) */
  cancelFileUpload(id: string): void {
    this.fileUploadAdapter.cancelFileUpload(id);
  }

  /* @conditional-compile-remove(file-sharing) */
  updateFileUploadProgress(id: string, progress: number): void {
    this.fileUploadAdapter.updateFileUploadProgress(id, progress);
  }

  /* @conditional-compile-remove(file-sharing) */
  updateFileUploadErrorMessage(id: string, errorMessage: string): void {
    this.fileUploadAdapter.updateFileUploadErrorMessage(id, errorMessage);
  }

  /* @conditional-compile-remove(file-sharing) */
  updateFileUploadMetadata(id: string, metadata: FileMetadata): void {
    this.fileUploadAdapter.updateFileUploadMetadata(id, metadata);
  }

  /* @conditional-compile-remove(teams-inline-images) */
  async downloadAuthenticatedAttachment(attachmentUrl: string): Promise<string> {
    if (!this.fileUploadAdapter.downloadAuthenticatedAttachment) {
      return '';
    }

    return await this.fileUploadAdapter.downloadAuthenticatedAttachment(attachmentUrl);
  }

  private messageReceivedListener(event: ChatMessageReceivedEvent): void {
    const message = convertEventToChatMessage(event);
    this.emitter.emit('messageReceived', { message });

    const currentUserId = toFlatCommunicationIdentifier(this.chatClient.getState().userId);
    if (message?.sender && toFlatCommunicationIdentifier(message.sender) === currentUserId) {
      this.emitter.emit('messageSent', { message });
    }
  }

  private messageReadListener({ chatMessageId, recipient }: ReadReceiptReceivedEvent): void {
    const message = this.getState().thread.chatMessages[chatMessageId];
    if (message) {
      this.emitter.emit('messageRead', { message, readBy: recipient });
    }
  }

  private participantsAddedListener({ addedBy, participantsAdded }: ParticipantsAddedEvent): void {
    this.emitter.emit('participantsAdded', { addedBy, participantsAdded });
  }

  private participantsRemovedListener({ removedBy, participantsRemoved }: ParticipantsRemovedEvent): void {
    this.emitter.emit('participantsRemoved', { removedBy, participantsRemoved });
  }

  private chatThreadPropertiesUpdatedListener(event: ChatThreadPropertiesUpdatedEvent): void {
    this.emitter.emit('topicChanged', { topic: event.properties.topic });
  }

  private subscribeAllEvents(): void {
    this.chatClient.on('chatThreadPropertiesUpdated', this.chatThreadPropertiesUpdatedListener.bind(this));
    this.chatClient.on('participantsAdded', this.participantsAddedListener.bind(this));
    this.chatClient.on('participantsRemoved', this.participantsRemovedListener.bind(this));
    this.chatClient.on('chatMessageReceived', this.messageReceivedListener.bind(this));
    this.chatClient.on('readReceiptReceived', this.messageReadListener.bind(this));
    this.chatClient.on('participantsRemoved', this.participantsRemovedListener.bind(this));
  }

  private unsubscribeAllEvents(): void {
    this.chatClient.off('chatThreadPropertiesUpdated', this.chatThreadPropertiesUpdatedListener.bind(this));
    this.chatClient.off('participantsAdded', this.participantsAddedListener.bind(this));
    this.chatClient.off('participantsRemoved', this.participantsRemovedListener.bind(this));
    this.chatClient.off('chatMessageReceived', this.messageReceivedListener.bind(this));
    this.chatClient.off('readReceiptReceived', this.messageReadListener.bind(this));
    this.chatClient.off('participantsRemoved', this.participantsRemovedListener.bind(this));
  }

  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageReceivedListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'topicChanged', listener: TopicChangedListener): void;
  on(event: 'error', listener: (e: AdapterError) => void): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, listener: (e: any) => void): void {
    this.emitter.on(event, listener);
  }

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageReceivedListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'topicChanged', listener: TopicChangedListener): void;
  off(event: 'error', listener: (e: AdapterError) => void): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: string, listener: (e: any) => void): void {
    this.emitter.off(event, listener);
  }

  private async asyncTeeErrorToEventEmitter<T>(f: () => Promise<T>): Promise<T> {
    try {
      return await f();
    } catch (error) {
      if (isChatError(error as Error)) {
        this.emitter.emit('error', error as AdapterError);
      }
      throw error;
    }
  }
}

const convertEventToChatMessage = (event: ChatMessageReceivedEvent): ChatMessage => {
  return {
    id: event.id,
    version: event.version,
    content: { message: event.message },
    type: convertEventType(event.type),
    sender: event.sender,
    senderDisplayName: event.senderDisplayName,
    sequenceId: '',
    createdOn: new Date(event.createdOn)
  };
};

// only text/html message type will be received from event
const convertEventType = (type: string): ChatMessageType => {
  const lowerCaseType = type.toLowerCase();
  if (lowerCaseType === 'richtext/html' || lowerCaseType === 'html') {
    return 'html';
  } else {
    return 'text';
  }
};

/**
 * Option bag to include when creating AzureCommunicationChatAdapter.
 * @public
 */
export type ChatAdapterOptions = {
  credential?: CommunicationTokenCredential;
};

/**
 * Arguments for creating the Azure Communication Services implementation of {@link ChatAdapter}.
 *
 * @public
 */
export type AzureCommunicationChatAdapterArgs = {
  endpoint: string;
  userId: CommunicationUserIdentifier;
  displayName: string;
  credential: CommunicationTokenCredential;
  threadId: string;
};

/**
 * Create a {@link ChatAdapter} backed by Azure Communication Services.
 *
 * This is the default implementation of {@link ChatAdapter} provided by this library.
 *
 * @public
 */
export const createAzureCommunicationChatAdapter = async ({
  endpoint: endpointUrl,
  userId,
  displayName,
  credential,
  threadId
}: AzureCommunicationChatAdapterArgs): Promise<ChatAdapter> => {
  if (!isValidIdentifier(userId)) {
    throw new Error('Provided userId is invalid. Please provide valid identifier object.');
  }

  const chatClient = createStatefulChatClient({
    userId,
    displayName,
    endpoint: endpointUrl,
    credential: credential
  });
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);
  await chatClient.startRealtimeNotifications();

  const options = { credential: credential };
  const adapter = await createAzureCommunicationChatAdapterFromClient(chatClient, chatThreadClient, options);

  return adapter;
};

/**
 * A custom React hook to simplify the creation of {@link ChatAdapter}.
 *
 * Similar to {@link createAzureCommunicationChatAdapter}, but takes care of asynchronous
 * creation of the adapter internally.
 *
 * Allows arguments to be undefined so that you can respect the rule-of-hooks and pass in arguments
 * as they are created. The adapter is only created when all arguments are defined.
 *
 * Note that you must memoize the arguments to avoid recreating adapter on each render.
 * See storybook for typical usage examples.
 *
 * @public
 */
export const useAzureCommunicationChatAdapter = (
  /**
   * Arguments to be passed to {@link createAzureCommunicationChatAdapter}.
   *
   * Allows arguments to be undefined so that you can respect the rule-of-hooks and pass in arguments
   * as they are created. The adapter is only created when all arguments are defined.
   */
  args: Partial<AzureCommunicationChatAdapterArgs>,
  /**
   * Optional callback to modify the adapter once it is created.
   *
   * If set, must return the modified adapter.
   */
  afterCreate?: (adapter: ChatAdapter) => Promise<ChatAdapter>,
  /**
   * Optional callback called before the adapter is disposed.
   *
   * This is useful for clean up tasks, e.g., leaving any ongoing calls.
   */
  beforeDispose?: (adapter: ChatAdapter) => Promise<void>
): ChatAdapter | undefined => {
  const { credential, displayName, endpoint, threadId, userId } = args;

  // State update needed to rerender the parent component when a new adapter is created.
  const [adapter, setAdapter] = useState<ChatAdapter | undefined>(undefined);
  // Ref needed for cleanup to access the old adapter created asynchronously.
  const adapterRef = useRef<ChatAdapter | undefined>(undefined);

  const afterCreateRef = useRef<((adapter: ChatAdapter) => Promise<ChatAdapter>) | undefined>(undefined);
  const beforeDisposeRef = useRef<((adapter: ChatAdapter) => Promise<void>) | undefined>(undefined);
  // These refs are updated on *each* render, so that the latest values
  // are used in the `useEffect` closures below.
  // Using a Ref ensures that new values for the callbacks do not trigger the
  // useEffect blocks, and a new adapter creation / distruction is not triggered.
  afterCreateRef.current = afterCreate;
  beforeDisposeRef.current = beforeDispose;

  useEffect(
    () => {
      if (!credential || !displayName || !endpoint || !threadId || !userId) {
        return;
      }
      (async () => {
        if (adapterRef.current) {
          // Dispose the old adapter when a new one is created.
          //
          // This clean up function uses `adapterRef` because `adapter` can not be added to the dependency array of
          // this `useEffect` -- we do not want to trigger a new adapter creation because of the first adapter
          // creation.
          if (beforeDisposeRef.current) {
            await beforeDisposeRef.current(adapterRef.current);
          }
          adapterRef.current.dispose();
          adapterRef.current = undefined;
        }

        let newAdapter = await createAzureCommunicationChatAdapter({
          credential,
          displayName,
          endpoint,
          threadId,
          userId
        });
        if (afterCreateRef.current) {
          newAdapter = await afterCreateRef.current(newAdapter);
        }
        adapterRef.current = newAdapter;
        setAdapter(newAdapter);
      })();
    },
    // Explicitly list all arguments so that caller doesn't have to memoize the `args` object.
    [adapterRef, afterCreateRef, beforeDisposeRef, credential, displayName, endpoint, threadId, userId]
  );

  // Dispose any existing adapter when the component unmounts.
  useEffect(() => {
    return () => {
      (async () => {
        if (adapterRef.current) {
          if (beforeDisposeRef.current) {
            await beforeDisposeRef.current(adapterRef.current);
          }
          adapterRef.current.dispose();
          adapterRef.current = undefined;
        }
      })();
    };
  }, []);

  return adapter;
};

/**
 * Create a {@link ChatAdapter} using the provided {@link StatefulChatClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulChatClient}.
 * Consider using {@link createAzureCommunicationChatAdapter} for a simpler API.
 *
 * @public
 */
export const createAzureCommunicationChatAdapterFromClient = async (
  chatClient: StatefulChatClient,
  chatThreadClient: ChatThreadClient,
  options?: ChatAdapterOptions
): Promise<ChatAdapter> => {
  return new AzureCommunicationChatAdapter(chatClient, chatThreadClient, options);
};

const isChatError = (e: Error): e is ChatError => {
  return e['target'] !== undefined && e['innerError'] !== undefined;
};
