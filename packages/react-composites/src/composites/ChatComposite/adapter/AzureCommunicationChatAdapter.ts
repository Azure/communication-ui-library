// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createStatefulChatClient, ChatClientState, StatefulChatClient } from 'chat-stateful-client';
import { DefaultChatHandlers, createDefaultChatHandlers } from 'chat-component-bindings';
import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';

import { CommunicationUserIdentifier, CommunicationUserKind, getIdentifierKind } from '@azure/communication-common';
import type {
  ChatMessageReceivedEvent,
  ChatThreadPropertiesUpdatedEvent,
  ParticipantsAddedEvent,
  ParticipantsRemovedEvent,
  ReadReceiptReceivedEvent
} from '@azure/communication-signaling';
import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import EventEmitter from 'events';
import { createAzureCommunicationUserCredential } from '../../../utils';
import {
  ChatAdapter,
  ChatEvent,
  ChatState,
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
      thread
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
      thread
    });
  }
}

export class AzureCommunicationChatAdapter implements ChatAdapter {
  private chatClient: StatefulChatClient;
  private chatThreadClient: ChatThreadClient;
  private context: ChatContext;
  private handlers: DefaultChatHandlers;
  private emitter: EventEmitter = new EventEmitter();

  constructor(chatClient: StatefulChatClient, chatThreadClient: ChatThreadClient) {
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

  dispose(): void {
    this.unsubscribeAllEvents();
  }

  fetchInitialData = async (): Promise<void> => {
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
  };

  public getState = (): ChatState => {
    return this.context.getState();
  };

  public onStateChange = (handler: (state: ChatState) => void): void => {
    this.context.onStateChange(handler);
  };

  public offStateChange = (handler: (state: ChatState) => void): void => {
    this.context.offStateChange(handler);
  };

  sendMessage = async (content: string): Promise<void> => {
    await this.handlers.onSendMessage(content);
  };

  sendReadReceipt = async (chatMessageId: string): Promise<void> => {
    await this.handlers.onMessageSeen(chatMessageId);
  };

  sendTypingIndicator = async (): Promise<void> => {
    await this.handlers.onTyping();
  };

  removeParticipant = async (userId: string): Promise<void> => {
    await this.handlers.onParticipantRemove(userId);
  };

  setTopic = async (topicName: string): Promise<void> => {
    await this.handlers.updateThreadTopicName(topicName);
  };

  loadPreviousChatMessages = async (messagesToLoad: number): Promise<boolean> => {
    return await this.handlers.onLoadPreviousChatMessages(messagesToLoad);
  };

  messageReceivedListener = (event: ChatMessageReceivedEvent): void => {
    const message = convertEventToChatMessage(event);
    this.emitter.emit('messageReceived', { message });

    const currentUserId = toFlatCommunicationIdentifier(this.chatClient.getState().userId);
    if (message?.sender && toFlatCommunicationIdentifier(message.sender) === currentUserId) {
      this.emitter.emit('messageSent', { message });
    }
  };

  messageReadListener = ({ chatMessageId, recipient }: ReadReceiptReceivedEvent): void => {
    const message = this.getState().thread.chatMessages[chatMessageId];
    if (message) {
      this.emitter.emit('messageRead', { message, readBy: recipient });
    }
  };

  participantsAddedListener = ({ addedBy, participantsAdded }: ParticipantsAddedEvent): void => {
    this.emitter.emit('participantsAdded', { addedBy, participantsAdded });
  };

  participantsRemovedListener = ({ removedBy, participantsRemoved }: ParticipantsRemovedEvent): void => {
    this.emitter.emit('participantsRemoved', { removedBy, participantsRemoved });
  };

  chatThreadPropertiesUpdatedListener = (event: ChatThreadPropertiesUpdatedEvent): void => {
    this.emitter.emit('topicChanged', { topic: event.properties.topic });
  };

  subscribeAllEvents = (): void => {
    this.chatClient.on('chatThreadPropertiesUpdated', this.chatThreadPropertiesUpdatedListener);
    this.chatClient.on('participantsAdded', this.participantsAddedListener);
    this.chatClient.on('participantsRemoved', this.participantsRemovedListener);
    this.chatClient.on('chatMessageReceived', this.messageReceivedListener);
    this.chatClient.on('readReceiptReceived', this.messageReadListener);
    this.chatClient.on('participantsRemoved', this.participantsRemovedListener);
  };

  unsubscribeAllEvents = (): void => {
    this.chatClient.off('chatThreadPropertiesUpdated', this.chatThreadPropertiesUpdatedListener);
    this.chatClient.off('participantsAdded', this.participantsAddedListener);
    this.chatClient.off('participantsRemoved', this.participantsRemovedListener);
    this.chatClient.off('chatMessageReceived', this.messageReceivedListener);
    this.chatClient.off('readReceiptReceived', this.messageReadListener);
    this.chatClient.off('participantsRemoved', this.participantsRemovedListener);
  };

  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageReceivedListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'topicChanged', listener: TopicChangedListener): void;
  on(event: 'error', listener: (e: Error) => void): void;
  on(event: ChatEvent, listener: (e: any) => void): void {
    this.emitter.on(event, listener);
  }

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageReceivedListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'participantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'participantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'topicChanged', listener: TopicChangedListener): void;
  off(event: 'error', listener: (e: Error) => void): void;
  off(event: ChatEvent, listener: (e: any) => void): void {
    this.emitter.off(event, listener);
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

export const createAzureCommunicationChatAdapter = async (
  userId: CommunicationUserIdentifier,
  token: string,
  endpointUrl: string,
  threadId: string,
  displayName: string,
  refreshTokenCallback?: (() => Promise<string>) | undefined
): Promise<ChatAdapter> => {
  const chatClient = createStatefulChatClient({
    userId: getIdentifierKind(userId) as CommunicationUserKind,
    displayName,
    endpoint: endpointUrl,
    credential: createAzureCommunicationUserCredential(token, refreshTokenCallback)
  });
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  chatClient.startRealtimeNotifications();

  const adapter = new AzureCommunicationChatAdapter(chatClient, chatThreadClient);
  return adapter;
};
