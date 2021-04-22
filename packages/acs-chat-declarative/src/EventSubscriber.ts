// © Microsoft Corporation. All rights reserved.
import { ChatClient } from '@azure/communication-chat';
import {
  ChatMessageDeletedEvent,
  ChatMessageEditedEvent,
  ChatMessageReceivedEvent,
  ChatThreadCreatedEvent,
  ChatThreadDeletedEvent,
  ChatThreadPropertiesUpdatedEvent,
  ParticipantsAddedEvent,
  ParticipantsRemovedEvent,
  ReadReceiptReceivedEvent,
  TypingIndicatorReceivedEvent
} from '@azure/communication-signaling';
import { ChatContext } from './ChatContext';
import { convertChatMessage } from './convertChatMessage';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
import { ReadReceipt } from './types/ReadReceipt';
import { TypingIndicator } from './types/TypingIndicator';

export class EventSubscriber {
  private chatClient: ChatClient;
  private chatContext: ChatContext;

  constructor(chatClient: ChatClient, chatContext: ChatContext) {
    this.chatClient = chatClient;
    this.chatContext = chatContext;
    this.subscribe();
  }

  private convertEventToChatMessage = (
    event: ChatMessageReceivedEvent | ChatMessageEditedEvent
  ): ChatMessageWithStatus => {
    return convertChatMessage({
      id: event.id,
      version: event.version,
      content: { message: event.content },
      type: event.type,
      sender: event.sender.user,
      senderDisplayName: event.sender.displayName,
      sequenceId: '', // Note: there is a bug in chatMessageReceived event that it is missing sequenceId
      createdOn: new Date(event.createdOn)
    });
  };

  private onChatMessageReceived = (event: ChatMessageReceivedEvent): void => {
    const newMessage = this.convertEventToChatMessage(event);
    // Because of bug in chatMessageReceived event, if we already have that particular message in context, we want to
    // make sure to not overwrite the sequenceId when calling setChatMessage.
    const existingMessage = this.chatContext.getState().threads.get(event.threadId)?.chatMessages.get(event.id);
    if (existingMessage) {
      newMessage.sequenceId = existingMessage.sequenceId;
    }
    this.chatContext.batch(() => {
      this.chatContext.createThreadIfNotExist(event.threadId);
      this.chatContext.setChatMessage(event.threadId, newMessage);
    });
  };

  private onChatMessageDeleted = (event: ChatMessageDeletedEvent): void => {
    this.chatContext.deleteMessage(event.threadId, event.id);
  };

  private onChatMessageEdited = (event: ChatMessageEditedEvent): void => {
    const editedMessage = this.convertEventToChatMessage(event);
    this.chatContext.setChatMessage(event.threadId, convertChatMessage(editedMessage));
  };

  private onParticipantsAdded = (event: ParticipantsAddedEvent): void => {
    const participantsToAdd = event.participantsAdded.map((participant) => ({
      ...participant,
      shareHistoryTime: participant.shareHistoryTime ? new Date(participant.shareHistoryTime) : undefined
    }));
    this.chatContext.batch(() => {
      this.chatContext.createThreadIfNotExist(event.threadId);
      this.chatContext.setParticipants(event.threadId, participantsToAdd);
    });
  };

  private onParticipantsRemoved = (event: ParticipantsRemovedEvent): void => {
    const participantIds = event.participantsRemoved.map((participant) => {
      return participant.user.communicationUserId;
    });
    this.chatContext.deleteParticipants(event.threadId, participantIds);
  };

  private onReadReceiptReceived = (event: ReadReceiptReceivedEvent): void => {
    const readReceipt: ReadReceipt = {
      ...event,
      sender: { communicationUserId: event.sender.user.communicationUserId },
      readOn: new Date(event.readOn)
    };
    this.chatContext.batch(() => {
      this.chatContext.createThreadIfNotExist(event.threadId);
      this.chatContext.addReadReceipt(event.threadId, readReceipt);
    });
  };

  private onTypingIndicatorReceived = (event: TypingIndicatorReceivedEvent): void => {
    const typingIndicator: TypingIndicator = {
      ...event,
      receivedOn: new Date(event.receivedOn)
    };
    this.chatContext.batch(() => {
      this.chatContext.createThreadIfNotExist(event.threadId);
      this.chatContext.addTypingIndicator(event.threadId, typingIndicator);
    });
  };

  private onChatThreadCreated = (event: ChatThreadCreatedEvent): void => {
    const threadInfo = {
      id: event.threadId,
      topic: event.properties.topic
    };
    if (!this.chatContext.createThreadIfNotExist(event.threadId, threadInfo)) {
      this.chatContext.updateThread(event.threadId, threadInfo);
    }
  };

  private onChatThreadDeleted = (event: ChatThreadDeletedEvent): void => {
    this.chatContext.deleteThread(event.threadId);
  };

  private onChatThreadPropertiesUpdated = (event: ChatThreadPropertiesUpdatedEvent): void => {
    const threadInfo = {
      id: event.threadId,
      topic: event.properties.topic
    };
    this.chatContext.updateThread(event.threadId, threadInfo);
  };

  public subscribe = (): void => {
    this.chatClient.on('chatMessageReceived', this.onChatMessageReceived);
    this.chatClient.on('chatMessageDeleted', this.onChatMessageDeleted);
    this.chatClient.on('chatMessageEdited', this.onChatMessageEdited);

    this.chatClient.on('participantsAdded', this.onParticipantsAdded);
    this.chatClient.on('participantsRemoved', this.onParticipantsRemoved);

    this.chatClient.on('readReceiptReceived', this.onReadReceiptReceived);
    this.chatClient.on('typingIndicatorReceived', this.onTypingIndicatorReceived);

    this.chatClient.on('chatThreadCreated', this.onChatThreadCreated);
    this.chatClient.on('chatThreadDeleted', this.onChatThreadDeleted);
    this.chatClient.on('chatThreadPropertiesUpdated', this.onChatThreadPropertiesUpdated);
  };

  public unsubscribe = (): void => {
    this.chatClient.off('chatMessageReceived', this.onChatMessageReceived);
    this.chatClient.off('chatMessageDeleted', this.onChatMessageDeleted);
    this.chatClient.off('chatMessageEdited', this.onChatMessageEdited);

    this.chatClient.off('participantsAdded', this.onParticipantsAdded);
    this.chatClient.off('participantsRemoved', this.onParticipantsRemoved);

    this.chatClient.off('readReceiptReceived', this.onReadReceiptReceived);
    this.chatClient.off('typingIndicatorReceived', this.onTypingIndicatorReceived);

    this.chatClient.off('chatThreadCreated', this.onChatThreadCreated);
    this.chatClient.off('chatThreadDeleted', this.onChatThreadDeleted);
    this.chatClient.off('chatThreadPropertiesUpdated', this.onChatThreadPropertiesUpdated);
  };
}
