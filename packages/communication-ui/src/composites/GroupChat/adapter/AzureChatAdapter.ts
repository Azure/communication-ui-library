// © Microsoft Corporation. All rights reserved.
import { ChatClientState, DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { DefaultHandlers, createDefaultHandlers } from '@azure/acs-chat-selector';
import { ChatMessage, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import EventEmitter from 'events';
import { GroupChatAdapter, GroupChatEvent, GroupChatState } from './GroupChatAdapter';

// Context of GroupChat, which is a centralized context for all state updates
export class GroupChatContext {
  private emitter: EventEmitter = new EventEmitter();
  private state: GroupChatState;
  private threadId: string;

  constructor(state: ChatClientState, threadId: string) {
    const thread = state.threads.get(threadId);
    this.threadId = threadId;
    if (!thread) throw 'Cannot find threadId, please initial thread before use!';
    this.state = {
      userId: state.userId,
      displayName: state.displayName,
      thread
    };
  }

  public onStateChange = (handler: (_uiState: GroupChatState) => void): void => {
    this.emitter.on('stateChanged', handler);
  };

  public offStateChange = (handler: (_uiState: GroupChatState) => void): void => {
    this.emitter.off('stateChanged', handler);
  };

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

  public updateClientState(state: ChatClientState): void {
    const thread = state.threads.get(this.threadId);
    if (!thread) throw 'Cannot find threadId, please make sure thread state is still in Stateful ChatClient.';
    this.setState({
      userId: state.userId,
      displayName: state.displayName,
      thread
    });
  }
}

export class AzureChatAdapter implements GroupChatAdapter {
  private chatClient: DeclarativeChatClient;
  private chatThreadClient: ChatThreadClient;
  private context: GroupChatContext;
  private handlers: DefaultHandlers;

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

    this.handlers = createDefaultHandlers(chatClient, chatThreadClient);

    this.chatClient.onStateChange(onStateChange);
  }

  fetchAllParticipants = async (): Promise<void> => {
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

  removeThreadMember = async (userId: string): Promise<void> => {
    await this.handlers.removeThreadMember(userId);
  };

  updateThreadTopicName = async (topicName: string): Promise<void> => {
    await this.handlers.updateThreadTopicName(topicName);
  };

  loadPreviousChatMessages = async (messagesToLoad: number): Promise<boolean> => {
    return await this.handlers.onLoadPreviousChatMessages(messagesToLoad);
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
