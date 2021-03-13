// © Microsoft Corporation. All rights reserved.
import { ChatClient } from '@azure/communication-chat';
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
      const newMessage = {
        id: event.id,
        version: event.version,
        content: { message: event.content },
        type: event.type,
        sender: event.sender.user,
        senderDisplayName: event.sender.displayName,
        sequenceId: '', // Note: there is a bug in chatMessageReceived event that it is missing sequenceId
        createdOn: new Date(event.createdOn)
      };
      // Because of bug in chatMessageReceived event, if we already have that particular message in context, we want to
      // make sure to not overwrite the sequenceId when calling setChatMessage.
      const existingMessage = this.chatContext.getState().threads.get(event.threadId)?.chatMessages.get(event.id);
      if (existingMessage) {
        newMessage.sequenceId = existingMessage.sequenceId;
      }
      this.chatContext.setChatMessage(event.threadId, convertChatMessage(newMessage));
    });
  };
}
