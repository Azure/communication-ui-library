// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatMessageReadReceipt, ChatMessageType } from '@azure/communication-chat';
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
} from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatContext } from './ChatContext';
import { convertChatMessage } from './convertChatMessage';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';

// TODO: When we can get messageId of event from SDK, remove this
// Maximum time to look back message list when we receive a system event
const maxSyncTimeInMs = 10 * 1000;

/**
 * @private
 */
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
      content: {
        message: event.message,
        /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
        attachments: event.attachments
      },
      type: this.convertEventType(event.type),
      sender: event.sender,
      senderDisplayName: event.senderDisplayName,
      sequenceId: '', // Note: there is a bug in chatMessageReceived event that it is missing sequenceId
      createdOn: new Date(event.createdOn),
      editedOn: 'editedOn' in event ? event.editedOn : undefined,
      metadata: event.metadata
    });
  };

  // convert event type to chatMessage type, only possible type is 'html' and 'text' in chat event
  private convertEventType = (type: string): ChatMessageType => {
    const lowerCaseType = type.toLowerCase();
    if (lowerCaseType === 'richtext/html' || lowerCaseType === 'html') {
      return 'html';
    } else {
      return 'text';
    }
  };

  private onChatMessageReceived = (event: ChatMessageReceivedEvent): void => {
    // Today we are avoiding how to render these messages. In the future we can
    // remove this condition and handle this message appropriately.
    const messageEventType = event.type.toLowerCase();
    if (messageEventType !== 'text' && messageEventType !== 'richtext/html' && messageEventType !== 'html') {
      return;
    }

    const newMessage = this.convertEventToChatMessage(event);

    // Because of bug in chatMessageReceived event, if we already have that particular message in context, we want to
    // make sure to not overwrite the sequenceId when calling setChatMessage.
    const existingMessage = this.chatContext.getState().threads[event.threadId]?.chatMessages[event.id];
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
    this.fetchLastParticipantMessage(event.threadId, 'participantAdded');
  };

  // This is a temporary fix that no participant message is received for onChatMessageReceived event, which should be handled by JS SDK.
  // Without the temporary fix, there are missing 'participant joined' and 'participant left' system messages in the chat thread.
  private fetchLastParticipantMessage = async (
    threadId: string,
    actionType: 'participantAdded' | 'participantRemoved'
  ): Promise<void> => {
    for await (const message of this.chatClient
      .getChatThreadClient(threadId)
      .listMessages({ startTime: new Date(Date.now() - maxSyncTimeInMs) })) {
      if (message.type === actionType) {
        this.chatContext.setChatMessage(threadId, { ...message, status: 'delivered' });
      }
    }
  };

  private onParticipantsRemoved = (event: ParticipantsRemovedEvent): void => {
    const participantIds = event.participantsRemoved.map((participant) => {
      return participant.id;
    });
    this.chatContext.deleteParticipants(event.threadId, participantIds);

    // If the current user is removed from the thread, do not fetch the last participant message
    // as they no longer have access to the thread.
    const currentUserId = toFlatCommunicationIdentifier(this.chatContext.getState().userId);
    const wasCurrentUserRemoved = participantIds.find((id) => toFlatCommunicationIdentifier(id) === currentUserId);
    if (!wasCurrentUserRemoved) {
      this.fetchLastParticipantMessage(event.threadId, 'participantRemoved');
    }
  };

  private onReadReceiptReceived = (event: ReadReceiptReceivedEvent): void => {
    const readReceipt: ChatMessageReadReceipt = {
      ...event,
      sender: event.sender,
      readOn: new Date(event.readOn)
    };
    this.chatContext.batch(() => {
      this.chatContext.createThreadIfNotExist(event.threadId);
      this.chatContext.addReadReceipt(event.threadId, readReceipt);
    });
  };

  private onTypingIndicatorReceived = (typingIndicator: TypingIndicatorReceivedEvent): void => {
    this.chatContext.batch(() => {
      this.chatContext.createThreadIfNotExist(typingIndicator.threadId);
      this.chatContext.addTypingIndicator(typingIndicator.threadId, typingIndicator);
    });
  };

  private onChatThreadCreated = (event: ChatThreadCreatedEvent): void => {
    const properties = {
      topic: event.properties.topic
    };
    if (!this.chatContext.createThreadIfNotExist(event.threadId, properties)) {
      this.chatContext.updateThread(event.threadId, properties);
    }
  };

  private onChatThreadDeleted = (event: ChatThreadDeletedEvent): void => {
    this.chatContext.deleteThread(event.threadId);
  };

  private onChatThreadPropertiesUpdated = (event: ChatThreadPropertiesUpdatedEvent): void => {
    this.chatContext.updateThread(event.threadId, { topic: event.properties.topic });
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
