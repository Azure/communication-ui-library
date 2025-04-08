// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  _createStatefulChatClientInner,
  ChatClientState,
  ChatError,
  StatefulChatClient
} from '@internal/chat-stateful-client';
import { ChatHandlers, createDefaultChatHandlers } from '@internal/chat-component-bindings';
import { ChatMessage, ChatMessageType, ChatThreadClient, SendMessageOptions } from '@azure/communication-chat';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import type {
  ChatMessageDeletedEvent,
  ChatMessageEditedEvent,
  ChatMessageReceivedEvent,
  ChatThreadPropertiesUpdatedEvent,
  ParticipantsAddedEvent,
  ParticipantsRemovedEvent,
  ReadReceiptReceivedEvent
} from '@azure/communication-chat';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import type { UploadChatImageResult } from '@internal/acs-ui-common';
import { toFlatCommunicationIdentifier, _TelemetryImplementationHint } from '@internal/acs-ui-common';
import { EventEmitter } from 'events';
import {
  ChatAdapter,
  ChatAdapterState,
  MessageDeletedListener,
  MessageEditedListener,
  MessageReadListener,
  MessageReceivedListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener,
  TopicChangedListener
} from './ChatAdapter';
import { ResourceDetails } from './ChatAdapter';
import { AdapterError } from '../../common/adapters';
import { useEffect, useRef, useState } from 'react';
import { _isValidIdentifier } from '@internal/acs-ui-common';
import { TEAMS_LIMITATION_LEARN_MORE, UNSUPPORTED_CHAT_THREAD_TYPE } from '../../common/constants';
/* @conditional-compile-remove(file-sharing-acs) */
import { MessageOptions } from '@internal/acs-ui-common';
/* @conditional-compile-remove(on-fetch-profile) */
import { createProfileStateModifier } from './OnFetchProfileCallback';
/* @conditional-compile-remove(on-fetch-profile) */
import type { OnFetchChatProfileCallback } from './OnFetchProfileCallback';

/* @conditional-compile-remove(on-fetch-profile) */
/**
 * @private
 */
export type AdapterStateModifier = (state: ChatAdapterState) => ChatAdapterState;

/* @conditional-compile-remove(on-fetch-profile) */
/**
 * Options for configuring the ChatAdapter.
 *
 * @public
 */
export type ChatAdapterOptions = {
  /**
   * Optional callback to fetch a chat profile
   */
  onFetchProfile?: OnFetchChatProfileCallback;
};
/**
 * Context of Chat, which is a centralized context for all state updates
 * @private
 */
export class ChatContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: ChatAdapterState;
  private threadId: string;
  /* @conditional-compile-remove(on-fetch-profile) */
  private displayNameModifier: AdapterStateModifier | undefined;

  constructor(
    clientState: ChatClientState,
    threadId: string,
    /* @conditional-compile-remove(on-fetch-profile) */
    chatAdapterOptions?: ChatAdapterOptions
  ) {
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
    /* @conditional-compile-remove(on-fetch-profile) */
    this.displayNameModifier = chatAdapterOptions?.onFetchProfile
      ? createProfileStateModifier(chatAdapterOptions.onFetchProfile, () => {
          this.setState(this.getState());
        })
      : undefined;
  }

  public onStateChange(handler: (_uiState: ChatAdapterState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: ChatAdapterState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: ChatAdapterState): void {
    this.state = state;
    /* @conditional-compile-remove(on-fetch-profile) */
    this.state = this.displayNameModifier ? this.displayNameModifier(state) : state;
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

    /* @conditional-compile-remove(file-sharing-acs) */
    updatedState = { ...updatedState };

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
  private handlers: ChatHandlers;
  private emitter: EventEmitter = new EventEmitter();

  constructor(
    chatClient: StatefulChatClient,
    chatThreadClient: ChatThreadClient,
    /* @conditional-compile-remove(on-fetch-profile) */
    chatAdapterOptions?: ChatAdapterOptions
  ) {
    this.bindAllPublicMethods();
    this.chatClient = chatClient;
    this.chatThreadClient = chatThreadClient;
    this.context = new ChatContext(
      chatClient.getState(),
      chatThreadClient.threadId,
      /* @conditional-compile-remove(on-fetch-profile) */
      chatAdapterOptions
    );

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
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    this.uploadImage = this.uploadImage.bind(this);
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    this.deleteImage = this.deleteImage.bind(this);
    this.sendReadReceipt = this.sendReadReceipt.bind(this);
    this.sendTypingIndicator = this.sendTypingIndicator.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.setTopic = this.setTopic.bind(this);
    this.loadPreviousChatMessages = this.loadPreviousChatMessages.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.downloadResourceToCache = this.downloadResourceToCache.bind(this);
    this.removeResourceFromCache = this.removeResourceFromCache.bind(this);
  }

  dispose(): void {
    this.unsubscribeAllEvents();
    this.chatClient.dispose();
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

  async sendMessage(
    content: string,
    options?: SendMessageOptions | /* @conditional-compile-remove(file-sharing-acs) */ MessageOptions
  ): Promise<void> {
    await this.asyncTeeErrorToEventEmitter(async () => {
      return await this.handlers.onSendMessage(content, options);
    });
  }

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  async uploadImage(image: Blob, imageFilename: string): Promise<UploadChatImageResult> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      return await this.handlers.onUploadImage(image, imageFilename);
    });
  }

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  async deleteImage(imageId: string): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      return await this.handlers.onDeleteImage(imageId);
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
    options?: Record<string, string> | /* @conditional-compile-remove(file-sharing-acs) */ MessageOptions
  ): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      /* @conditional-compile-remove(file-sharing-acs) */
      const messageOptions: MessageOptions = {};
      /* @conditional-compile-remove(file-sharing-acs) */
      if (
        options &&
        // if options.attachments is an array or undefined (for removal all attachments),
        // then given options is a MessageOptions
        (Array.isArray(options.attachments) || options.attachments === undefined)
      ) {
        messageOptions.attachments = options.attachments ?? [];
      }
      /* @conditional-compile-remove(file-sharing-acs) */
      if (
        options &&
        // if options.metadata is provided, we need to add it in MessageOptions
        options.metadata &&
        typeof options.metadata === 'object'
      ) {
        messageOptions.metadata = options.metadata;
      }
      /* @conditional-compile-remove(file-sharing-acs) */
      if (options && !('attachments' in options) && !('metadata' in options)) {
        // if options don't have attachments or metadata,
        // then it is a Record<string, string>
        /* @conditional-compile-remove(file-sharing-acs) */
        return await this.handlers.onUpdateMessage(messageId, content, options);
      }
      /* @conditional-compile-remove(file-sharing-acs) */
      return await this.handlers.onUpdateMessage(messageId, content, messageOptions);
      // metadata is never used in the current stable
      return await this.handlers.onUpdateMessage(messageId, content);
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    return await this.asyncTeeErrorToEventEmitter(async () => {
      return await this.handlers.onDeleteMessage(messageId);
    });
  }

  async downloadResourceToCache(resourceDetails: ResourceDetails): Promise<void> {
    this.chatClient.downloadResourceToCache(
      resourceDetails.threadId,
      resourceDetails.messageId,
      resourceDetails.resourceUrl
    );
  }

  removeResourceFromCache(resourceDetails: ResourceDetails): void {
    this.chatClient.removeResourceFromCache(
      resourceDetails.threadId,
      resourceDetails.messageId,
      resourceDetails.resourceUrl
    );
  }

  private messageReceivedListener(event: ChatMessageReceivedEvent): void {
    const isCurrentChatAdapterThread = event.threadId === this.chatThreadClient.threadId;

    if (!isCurrentChatAdapterThread) {
      return;
    }

    const message = convertEventToChatMessage(event);
    this.emitter.emit('messageReceived', { message });

    const currentUserId = toFlatCommunicationIdentifier(this.chatClient.getState().userId);
    if (message?.sender && toFlatCommunicationIdentifier(message.sender) === currentUserId) {
      this.emitter.emit('messageSent', { message });
    }
  }

  private messageEditedListener(event: ChatMessageEditedEvent): void {
    const isCurrentChatAdapterThread = event.threadId === this.chatThreadClient.threadId;
    if (!isCurrentChatAdapterThread) {
      return;
    }

    const message = convertEventToChatMessage(event);
    this.emitter.emit('messageEdited', { message });
  }

  private messageDeletedListener(event: ChatMessageDeletedEvent): void {
    const isCurrentChatAdapterThread = event.threadId === this.chatThreadClient.threadId;
    if (!isCurrentChatAdapterThread) {
      return;
    }

    const message = convertEventToChatMessage(event);
    this.emitter.emit('messageDeleted', { message });
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
    this.chatClient.on('chatMessageEdited', this.messageEditedListener.bind(this));
    this.chatClient.on('chatMessageDeleted', this.messageDeletedListener.bind(this));
    this.chatClient.on('readReceiptReceived', this.messageReadListener.bind(this));
    this.chatClient.on('participantsRemoved', this.participantsRemovedListener.bind(this));
  }

  private unsubscribeAllEvents(): void {
    this.chatClient.off('chatThreadPropertiesUpdated', this.chatThreadPropertiesUpdatedListener.bind(this));
    this.chatClient.off('participantsAdded', this.participantsAddedListener.bind(this));
    this.chatClient.off('participantsRemoved', this.participantsRemovedListener.bind(this));
    this.chatClient.off('chatMessageReceived', this.messageReceivedListener.bind(this));
    this.chatClient.off('chatMessageEdited', this.messageEditedListener.bind(this));
    this.chatClient.off('chatMessageDeleted', this.messageDeletedListener.bind(this));
    this.chatClient.off('readReceiptReceived', this.messageReadListener.bind(this));
    this.chatClient.off('participantsRemoved', this.participantsRemovedListener.bind(this));
  }

  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageEdited', listener: MessageEditedListener): void;
  on(event: 'messageDeleted', listener: MessageDeletedListener): void;
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
  off(event: 'messageEdited', listener: MessageEditedListener): void;
  off(event: 'messageDeleted', listener: MessageDeletedListener): void;
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

const convertEventToChatMessage = (
  event: ChatMessageReceivedEvent | ChatMessageEditedEvent | ChatMessageDeletedEvent
): ChatMessage => {
  return {
    id: event.id,
    version: event.version,
    content: isChatMessageDeletedEvent(event) ? undefined : { message: event.message },
    type: convertEventType(event.type),
    sender: event.sender,
    senderDisplayName: event.senderDisplayName,
    sequenceId: '',
    createdOn: new Date(event.createdOn),
    editedOn: isChatMessageEditedEvent(event) ? event.editedOn : undefined,
    deletedOn: isChatMessageDeletedEvent(event) ? event.deletedOn : undefined
  };
};

const isChatMessageEditedEvent = (
  event: ChatMessageReceivedEvent | ChatMessageEditedEvent | ChatMessageDeletedEvent
): event is ChatMessageEditedEvent => {
  return 'editedOn' in event;
};

const isChatMessageDeletedEvent = (
  event: ChatMessageReceivedEvent | ChatMessageEditedEvent | ChatMessageDeletedEvent
): event is ChatMessageDeletedEvent => {
  return 'deletedOn' in event;
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
  /* @conditional-compile-remove(on-fetch-profile) */
  chatAdapterOptions?: ChatAdapterOptions;
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
  threadId,
  /* @conditional-compile-remove(on-fetch-profile) */
  chatAdapterOptions
}: AzureCommunicationChatAdapterArgs): Promise<ChatAdapter> => {
  return _createAzureCommunicationChatAdapterInner(
    endpointUrl,
    userId,
    displayName,
    credential,
    threadId,
    'Chat' as _TelemetryImplementationHint,
    /* @conditional-compile-remove(on-fetch-profile) */
    chatAdapterOptions
  );
};

/**
 * This inner function is used to allow injection of TelemetryImplementationHint without changing the public API.
 *
 * @internal
 */
export const _createAzureCommunicationChatAdapterInner = async function (
  endpoint: string,
  userId: CommunicationUserIdentifier,
  displayName: string,
  credential: CommunicationTokenCredential,
  threadId: string,
  telemetryImplementationHint: _TelemetryImplementationHint = 'Chat',
  /* @conditional-compile-remove(on-fetch-profile) */
  chatAdapterOptions?: ChatAdapterOptions
): Promise<ChatAdapter> {
  if (!_isValidIdentifier(userId)) {
    throw new Error('Provided userId is invalid. Please provide valid identifier object.');
  }

  const chatClient = _createStatefulChatClientInner(
    {
      userId,
      displayName,
      endpoint,
      credential
    },
    undefined,
    telemetryImplementationHint
  );
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);
  await chatClient.startRealtimeNotifications();

  const adapter = await createAzureCommunicationChatAdapterFromClient(
    chatClient,
    chatThreadClient,
    /* @conditional-compile-remove(on-fetch-profile) */
    chatAdapterOptions
  );

  return adapter;
};

/**
 * This inner function to create ChatAdapterPromise in case when threadID is not avaialble.
 * ThreadId is a promise to allow for lazy initialization of the adapter.
 * @internal
 */
export const _createLazyAzureCommunicationChatAdapterInner = async function (
  endpoint: string,
  userId: CommunicationUserIdentifier,
  displayName: string,
  credential: CommunicationTokenCredential,
  threadId: Promise<string>,
  telemetryImplementationHint: _TelemetryImplementationHint = 'Chat',
  /* @conditional-compile-remove(on-fetch-profile) */
  chatAdapterOptions?: ChatAdapterOptions
): Promise<ChatAdapter> {
  if (!_isValidIdentifier(userId)) {
    throw new Error('Provided userId is invalid. Please provide valid identifier object.');
  }

  const chatClient = _createStatefulChatClientInner(
    {
      userId,
      displayName,
      endpoint,
      credential
    },
    undefined,
    telemetryImplementationHint
  );
  return threadId.then(async (threadId) => {
    if (UNSUPPORTED_CHAT_THREAD_TYPE.some((t) => threadId.includes(t))) {
      console.error(
        `Invalid Chat ThreadId: ${threadId}. Please note with Teams Channel Meetings, only Calling is supported and Chat is not currently supported. Read more: ${TEAMS_LIMITATION_LEARN_MORE}.`
      );
    }

    const chatThreadClient = await chatClient.getChatThreadClient(threadId);
    await chatClient.startRealtimeNotifications();

    const adapter = await createAzureCommunicationChatAdapterFromClient(
      chatClient,
      chatThreadClient,
      /* @conditional-compile-remove(on-fetch-profile) */
      chatAdapterOptions
    );

    return adapter;
  });
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
  const creatingAdapterRef = useRef<boolean>(false);

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
        if (creatingAdapterRef.current) {
          console.warn(
            'Adapter is already being created, please see storybook for more information: https://azure.github.io/communication-ui-library/?path=/story/troubleshooting--page'
          );
          return;
        }
        creatingAdapterRef.current = true;
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
        creatingAdapterRef.current = false;
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
export async function createAzureCommunicationChatAdapterFromClient(
  chatClient: StatefulChatClient,
  chatThreadClient: ChatThreadClient,
  /* @conditional-compile-remove(on-fetch-profile) */
  chatAdapterOptions?: ChatAdapterOptions
): Promise<ChatAdapter> {
  return new AzureCommunicationChatAdapter(
    chatClient,
    chatThreadClient,
    /* @conditional-compile-remove(on-fetch-profile) */
    chatAdapterOptions
  );
}

const isChatError = (e: Error): e is ChatError => {
  return 'target' in e && e['target'] !== undefined && 'innerError' in e && e['innerError'] !== undefined;
};
