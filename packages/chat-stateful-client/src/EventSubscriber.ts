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
        attachments: [
          { "id": "3faba733-f8d2-4d76-8089-4dfe39358b33",
            "attachmentType": "file",
            "contentType": "bmp",
            "name": "example.bmp",
            "url": "https://adatumbiz-my.sharepoint.com/personal/insravan_adatum_biz/_layouts/download.aspx?share=ETOnqz_S-HZNgIlN_jk1izMB3Td8THUA6HbZMQ_IDPg4bw",
            "previewUrl": "https://adatumbiz-my.sharepoint.com/:i:/g/personal/insravan_adatum_biz/ETOnqz_S-HZNgIlN_jk1izMB3Td8THUA6HbZMQ_IDPg4bw"
      
          },
          {
            "id": "ef2f7cbd-2ab2-42d6-a84f-1d2c544e8a51",
            "attachmentType": "file",
            "contentType": "ddl",
            "name": "example.ddl",
            "url": "https://adatumbiz-my.sharepoint.com/personal/insravan_adatum_biz/_layouts/download.aspx?share=Eb18L--yKtZCqE8dLFROilEBvOjAc723Ut0aVDojx2aYuQ",
            "previewUrl": "https://adatumbiz-my.sharepoint.com/:u:/g/personal/insravan_adatum_biz/Eb18L--yKtZCqE8dLFROilEBvOjAc723Ut0aVDojx2aYuQ"
          },
          {
            "id": "4c7c9921-857e-47cd-bec3-1d43375b90a8",
            "attachmentType": "file",
            "contentType": "dmg",
            "name": "example.dmg",
            "url": "https://adatumbiz-my.sharepoint.com/personal/insravan_adatum_biz/_layouts/download.aspx?share=ESGZfEx-hc1HvsMdQzdbkKgBIR56lkGwiuvCny0NCNLr5A",
            "previewUrl": "https://adatumbiz-my.sharepoint.com/:u:/g/personal/insravan_adatum_biz/ESGZfEx-hc1HvsMdQzdbkKgBIR56lkGwiuvCny0NCNLr5A"
          },
          {
            "id": "7fa0665e-e93e-4530-9432-3386dfc43d0b",
            "attachmentType": "file",
            "contentType": "docx",
            "name": "example.docx",
            "url": "https://adatumbiz-my.sharepoint.com/personal/insravan_adatum_biz/_layouts/download.aspx?share=EV5moH8-6TBFlDIzht_EPQsBj8R4bLcouLkCMViaH4DJ6g",
            "previewUrl": "https://adatumbiz-my.sharepoint.com/:w:/g/personal/insravan_adatum_biz/EV5moH8-6TBFlDIzht_EPQsBj8R4bLcouLkCMViaH4DJ6g"
          },
          {
            "id": "cd83b0ef-c771-4910-9fc9-fa56b6c36001",
            "attachmentType": "file",
            "contentType": "exe",
            "name": "example.exe",
            "url": "https://adatumbiz-my.sharepoint.com/personal/insravan_adatum_biz/_layouts/download.aspx?share=Ee-wg81xxxBJn8n6VrbDYAEBGYnz9-KgEa4sj_G2uLA5MQ",
            "previewUrl": "https://adatumbiz-my.sharepoint.com/:u:/g/personal/insravan_adatum_biz/Ee-wg81xxxBJn8n6VrbDYAEBGYnz9-KgEa4sj_G2uLA5MQ"
          },
          {
            "id": "5bfc1f90-ce24-42bd-a8c6-26dc709ce88b",
            "attachmentType": "file",
            "contentType": "ico",
            "name": "example.ico",
            "url": "https://adatumbiz-my.sharepoint.com/personal/insravan_adatum_biz/_layouts/download.aspx?share=EZAf_Fskzr1CqMYm3HCc6IsBJZY9mp3a43s4UKdBORUiuA",
            "previewUrl": "https://adatumbiz-my.sharepoint.com/:i:/g/personal/insravan_adatum_biz/EZAf_Fskzr1CqMYm3HCc6IsBJZY9mp3a43s4UKdBORUiuA"
          },
          {
            "id": "c80af5f1-8c11-48fc-8305-65dbebf78230",
            "attachmentType": "file",
            "contentType": "java",
            "name": "example.java",
            "url": "https://adatumbiz-my.sharepoint.com/personal/insravan_adatum_biz/_layouts/download.aspx?share=EfH1CsgRjPxIgwVl2-v3gjABdlg1DKPU2tq1HvQBvVyBsQ",
            "previewUrl": "https://adatumbiz-my.sharepoint.com/:u:/g/personal/insravan_adatum_biz/EfH1CsgRjPxIgwVl2-v3gjABdlg1DKPU2tq1HvQBvVyBsQ"
          },
          {
            "id": "0-wus-d10-34853c12a29c886ef8fc12608a8b2070",
            "attachmentType": "teamsImage",
            "contentType": "jpg",
            "name": "example.jpg",
            "url": "https://global.chat.ppe.communication.microsoft.com/chat/threads/19:792QHxHUgR5PHsiVOqGUlkGWnvqL3FEwoiYS_bPbGH01@thread.v2/messages/1683677350504/teamsInterop/images/0-wus-d10-34853c12a29c886ef8fc12608a8b2070/views/original?api-version=2023-04-01-preview",
            "previewUrl": "https://global.chat.ppe.communication.microsoft.com/chat/threads/19:792QHxHUgR5PHsiVOqGUlkGWnvqL3FEwoiYS_bPbGH01@thread.v2/messages/1683677350504/teamsInterop/images/0-wus-d10-34853c12a29c886ef8fc12608a8b2070/views/small?api-version=2023-04-01-preview"
          },
          {
            "id": "764e04cc-e153-49f6-9cfd-4e197186dcd5",
            "attachmentType": "file",
            "contentType": "js",
            "name": "example.js",
            "url": "https://adatumbiz-my.sharepoint.com/personal/insravan_adatum_biz/_layouts/download.aspx?share=EcwETnZT4fZJnP1OGXGG3NUB7Bk1wcwIgq3NwNvxhGboIw",
            "previewUrl": "https://adatumbiz-my.sharepoint.com/:u:/g/personal/insravan_adatum_biz/EcwETnZT4fZJnP1OGXGG3NUB7Bk1wcwIgq3NwNvxhGboIw"
          },
          {
            "id": "381bc9bc-2332-498a-8b96-9afbbba68335",
            "attachmentType": "file",
            "contentType": "json",
            "name": "example.json",
            "url": "https://adatumbiz-my.sharepoint.com/personal/insravan_adatum_biz/_layouts/download.aspx?share=EbzJGzgyI4pJi5aa-7umgzUB_DxSz_bcpW7rp1hJ4am7yg",
            "previewUrl": "https://adatumbiz-my.sharepoint.com/:u:/g/personal/insravan_adatum_biz/EbzJGzgyI4pJi5aa-7umgzUB_DxSz_bcpW7rp1hJ4am7yg"
          }]
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
