// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { chatClientDeclaratify, ChatClientState, DeclarativeChatClient } from '@azure/acs-chat-declarative';
import {
  DefaultChatHandlers,
  communicationIdentifierToString,
  createDefaultChatHandlers
} from '@azure/acs-chat-selector';
import { ChatClient, ChatMessage, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { CommunicationUserKind } from '@azure/communication-signaling';
import EventEmitter from 'events';
import { createAzureCommunicationUserCredential, getIdFromToken } from '../../../utils';
import { GroupChatAdapter, GroupChatEvent, GroupChatState } from './GroupChatAdapter';
import { CommunicationParticipant, ContextualMenuItem } from 'react-components';

// Context of GroupChat, which is a centralized context for all state updates
export class GroupChatContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: GroupChatState;
  private threadId: string;

  constructor(clientState: ChatClientState, threadId: string) {
    const thread = clientState.threads.get(threadId);
    this.threadId = threadId;
    if (!thread) throw 'Cannot find threadId, please initialize thread before use!';
    this.state = {
      userId: communicationIdentifierToString(clientState.userId),
      displayName: clientState.displayName,
      thread
    };
  }

  public onStateChange(handler: (_uiState: GroupChatState) => void): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (_uiState: GroupChatState) => void): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: GroupChatState): void {
    this.state = state;
    this.emitter.emit('stateChanged', this.state);
  }

  public getState(): GroupChatState {
    return this.state;
  }

  public setError(error: Error): void {
    this.setState({ ...this.state, error });
  }

  public updateClientState(clientState: ChatClientState): void {
    const thread = clientState.threads.get(this.threadId);
    if (!thread) throw 'Cannot find threadId, please make sure thread state is still in Stateful ChatClient.';
    this.setState({
      userId: communicationIdentifierToString(clientState.userId),
      displayName: clientState.displayName,
      thread
    });
  }
}

export class AzureCommunicationChatAdapter implements GroupChatAdapter {
  private chatClient: DeclarativeChatClient;
  private chatThreadClient: ChatThreadClient;
  private context: GroupChatContext;
  private handlers: DefaultChatHandlers;

  constructor(chatClient: DeclarativeChatClient, chatThreadClient: ChatThreadClient) {
    this.chatClient = chatClient;
    this.chatThreadClient = chatThreadClient;
    this.context = new GroupChatContext(chatClient.state, chatThreadClient.threadId);
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
  }

  updateAllParticipants = async (): Promise<void> => {
    try {
      for await (const _page of this.chatThreadClient.listParticipants().byPage({
        // Fetch 100 participants per page by default.
        maxPageSize: 100
      }));
    } catch (e) {
      console.log(e);
    }
  };

  public getState = (): GroupChatState => {
    return this.context.getState();
  };

  public onStateChange = (handler: (state: GroupChatState) => void): void => {
    this.context.onStateChange(handler);
  };

  public offStateChange = (handler: (state: GroupChatState) => void): void => {
    this.context.offStateChange(handler);
  };

  sendMessage = async (content: string): Promise<void> => {
    await this.handlers.onMessageSend(content);
  };

  sendReadReceipt = async (chatMessageId: string): Promise<void> => {
    await this.handlers.onMessageSeen(chatMessageId);
  };

  sendTypingIndicator = async (): Promise<void> => {
    await this.handlers.onTyping();
  };

  removeParticipant = async (userId: string): Promise<void> => {
    await this.handlers.removeThreadMember(userId);
  };

  setTopic = async (topicName: string): Promise<void> => {
    await this.handlers.updateThreadTopicName(topicName);
  };

  loadPreviousChatMessages = async (messagesToLoad: number): Promise<boolean> => {
    return await this.handlers.onLoadPreviousChatMessages(messagesToLoad);
  };

  onRenderParticipantMenu = (participant: CommunicationParticipant): ContextualMenuItem[] => {
    return this.handlers.onRenderParticipantMenu(participant);
  };

  on(event: 'messageReceived', messageReceivedHandler: (message: ChatMessage) => void): void;
  on(event: 'participantsJoined', participantsJoinedHandler: (participant: ChatParticipant) => void): void;
  on(event: 'error', errorHandler: (e: Error) => void): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public on(_event: GroupChatEvent, _listener: (e: any) => void): void {
    // Need to be implemented from chatClient
    throw 'Not implemented yet';
  }
}

export const createAzureCommunicationChatAdapter = async (
  token: string,
  endpointUrl: string,
  threadId: string,
  displayName: string,
  refreshTokenCallback?: (() => Promise<string>) | undefined
): Promise<AzureCommunicationChatAdapter> => {
  const rawUserId = getIdFromToken(token);

  // This hack can be removed when `getIdFromToken` is dropped in favour of actually passing in user credentials.
  const userId = <CommunicationUserKind>{ kind: 'communicationUser', communicationUserId: rawUserId };
  const chatClient = chatClientDeclaratify(
    new ChatClient(endpointUrl, createAzureCommunicationUserCredential(token, refreshTokenCallback)),
    { userId, displayName }
  );
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  chatClient.startRealtimeNotifications();

  const adapter = new AzureCommunicationChatAdapter(chatClient, chatThreadClient);
  return adapter;
};
