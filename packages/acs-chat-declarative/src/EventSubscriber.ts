// © Microsoft Corporation. All rights reserved.
import { ChatClient, ChatMessagePriority } from '@azure/communication-chat';
import { ChatContext } from './ChatContext';
import { convertChatMessage } from './ChatThreadClientDeclarative';

export class EventSubscriber {
  private chatClient: ChatClient;
  private chatContext: ChatContext;

  constructor(chatClient: ChatClient, chatContext: ChatContext) {
    this.chatClient = chatClient;
    this.chatContext = chatContext;
    this.subscribe();
  }

  private subscribe = (): void => {
    // ToDo: handle all events to build up CallClientState
    this.chatClient.on('chatMessageReceived', (event) => {
      const { threadId: _threadId, recipient: _recipient, ...newMessage } = {
        ...event,
        priority: event.priority as ChatMessagePriority,
        createdOn: new Date(event.createdOn)
      };
      this.chatContext.setChatMessage(event.threadId, convertChatMessage(newMessage));
    });
  };
}
