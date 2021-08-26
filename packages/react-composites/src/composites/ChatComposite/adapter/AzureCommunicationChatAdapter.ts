// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  createStatefulChatClient,
  ChatClientState,
  ChatError,
  StatefulChatClient
} from '@internal/chat-stateful-client';
import { ChatHandlers, createDefaultChatHandlers } from '@internal/chat-component-bindings';
import { ErrorType } from '@internal/react-components';
import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import { CommunicationTokenCredential, CommunicationIdentifierKind } from '@azure/communication-common';
import type {
  ChatMessageReceivedEvent,
  ChatThreadPropertiesUpdatedEvent,
  ParticipantsAddedEvent,
  ParticipantsRemovedEvent,
  ReadReceiptReceivedEvent
} from '@azure/communication-signaling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import EventEmitter from 'events';
import {
  ChatAdapter,
  ChatEvent,
  ChatState,
  ChatErrorListener,
  MessageReadListener,
  MessageReceivedListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener,
  TopicChangedListener
} from './ChatAdapter';

// Context of Chat, which is a centralized context for all state updates
class ChatContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: ChatState;
  private threadId: string;

  constructor(clientState: ChatClientState, threadId: string) {
    const thread = clientState.threads[threadId];
    this.threadId = threadId;
    if (!thread) throw 'Cannot find threadId, please initialize thread before use!';
    this.state = {
      userId: toFlatCommunicationIdentifier(clientState.userId),
      displayName: clientState.displayName,
      thread,
      latestErrors: clientState.latestErrors
    };
  }

  public onStateChange(handler: (_uiState: ChatState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: ChatState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: ChatState): void {
    this.state = state;
    this.emitter.emit('stateChanged', this.state);
  }

  public getState(): ChatState {
    return this.state;
  }

  public setError(error: Error): void {
    this.setState({ ...this.state, error });
  }

  public updateClientState(clientState: ChatClientState): void {
    const thread = clientState.threads[this.threadId];
    if (!thread) throw 'Cannot find threadId, please make sure thread state is still in Stateful ChatClient.';
    this.setState({
      userId: toFlatCommunicationIdentifier(clientState.userId),
      displayName: clientState.displayName,
      thread,
      latestErrors: clientState.latestErrors
    });
  }
}

export class AzureCommunicationChatAdapter implements ChatAdapter {
  private chatClient: StatefulChatClient;
  private chatThreadClient: ChatThreadClient;
  private context: ChatContext;
  private handlers: ChatHandlers;
  private emitter: EventEmitter = new EventEmitter();

  constructor(chatClient: StatefulChatClient, chatThreadClient: ChatThreadClient) {
    this.bindAllPublicMethods();
    this.chatClient = chatClient;
    this.chatThreadClient = chatThreadClient;
    this.context = new ChatContext(chatClient.getState(), chatThreadClient.threadId);
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
    this.removeParticipant = this.removeParticipant.bind(this);
    this.setTopic = this.setTopic.bind(this);
    this.loadPreviousChatMessages = this.loadPreviousChatMessages.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }

  dispose(): void {
    this.unsubscribeAllEvents();
  }

  async fetchInitialData(): Promise<void> {
    try {
      await this.chatThreadClient.getProperties();
    } catch (e) {
      console.log(e);
    }

    // Fetch all participants who joined before the local user.
    try {
      for await (const _page of this.chatThreadClient.listParticipants().byPage({
        // Fetch 100 participants per page by default.
        maxPageSize: 100
      }));
    } catch (e) {
      console.log(e);
    }
  }

  getState(): ChatState {
    return this.context.getState();
  }

  onStateChange(handler: (state: ChatState) => void): void {
    this.context.onStateChange(handler);
  }

  offStateChange(handler: (state: ChatState) => void): void {
    this.context.offStateChange(handler);
  }

  async sendMessage(content: string): Promise<void> {
    await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onSendMessage(content);
    });
  }

  async sendReadReceipt(chatMessageId: string): Promise<void> {
    await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onMessageSeen(chatMessageId);
    });
  }

  async sendTypingIndicator(): Promise<void> {
    await this.handlers.onTyping();
  }

  async removeParticipant(userId: string): Promise<void> {
    await this.asyncTeeErrorToEventEmitter(async () => {
      await this.handlers.onParticipantRemove(userId);
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

  clearErrors(errorTypes: ErrorType[]): void {
    this.handlers.onDismissErrors(errorTypes);
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
  on(event: 'error', listener: ChatErrorListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: ChatEvent, listener: (e: any) => void): void {
    this.emitter.on(event, listener);
  }

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageReceivedListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'topicChanged', listener: TopicChangedListener): void;
  off(event: 'error', listener: ChatErrorListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: ChatEvent, listener: (e: any) => void): void {
    this.emitter.off(event, listener);
  }

  private async asyncTeeErrorToEventEmitter<T>(f: () => Promise<T>): Promise<T> {
    try {
      return await f();
    } catch (error) {
      if (isChatError(error)) {
        this.emitter.emit('error', { operation: error.target, error: error.inner });
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
    type: event.type,
    sender: event.sender,
    senderDisplayName: event.senderDisplayName,
    sequenceId: '',
    createdOn: new Date(event.createdOn)
  };
};

export type AzureCommunicationChatAdapterArgs = {
  endpointUrl: string;
  userId: CommunicationIdentifierKind;
  displayName: string;
  credential: CommunicationTokenCredential;
  threadId: string;
};

export const createAzureCommunicationChatAdapter = async ({
  endpointUrl,
  userId,
  displayName,
  credential,
  threadId
}: AzureCommunicationChatAdapterArgs): Promise<ChatAdapter> => {
  const chatClient = createStatefulChatClient({
    userId: userId,
    displayName,
    endpoint: endpointUrl,
    credential: credential
  });
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  chatClient.startRealtimeNotifications();

  const adapter = new AzureCommunicationChatAdapter(chatClient, chatThreadClient);
  return adapter;
};

const isChatError = (e: Error): e is ChatError => {
  return e['target'] !== undefined && e['inner'] !== undefined;
};
