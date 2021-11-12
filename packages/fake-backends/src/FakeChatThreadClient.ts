// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AddChatParticipantsResult,
  AddParticipantsRequest,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadProperties,
  ListMessagesOptions,
  ListParticipantsOptions,
  ListReadReceiptsOptions,
  SendChatMessageResult,
  SendMessageRequest,
  SendReadReceiptRequest,
  UpdateMessageOptions
} from '@azure/communication-chat';
import { CommunicationIdentifier, getIdentifierKind } from '@azure/communication-common';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { bumpMessageVersion, Model, Thread } from './Model';
import { ThreadEventEmitter } from './ThreadEventEmitter';
import { IChatThreadClient } from './types';
import { chatToSignalingParticipant, pagedAsyncIterator } from './utils';

/**
 * A public interface compatible stub for ChatThreadClient.
 */
export class FakeChatThreadClient implements IChatThreadClient {
  constructor(private model: Model, private userId: CommunicationIdentifier, public threadId: string) {}

  getProperties(): Promise<ChatThreadProperties> {
    const thread = this.checkedGetThread();
    return Promise.resolve({
      id: thread.id,
      topic: thread.topic,
      createdOn: thread.createdOn,
      createdBy: thread.createdBy,
      deletedOn: thread.deletedOn
    });
  }

  updateTopic(topic: string): Promise<void> {
    this.modifyThreadForUser((thread) => {
      thread.topic = topic;
    });
    this.checkedGetThreadEventEmitter().chatThreadPropertiesUpdated({
      properties: { topic: topic },
      updatedOn: new Date(Date.now()),
      updatedBy: chatToSignalingParticipant(this.checkedGetMe()),
      threadId: this.threadId,
      version: `${this.checkedGetThread().version}`
    });
    return Promise.resolve();
  }

  sendMessage(request: SendMessageRequest): Promise<SendChatMessageResult> {
    const me = this.checkedGetMe();
    this.modifyThreadForUser((thread) => {
      thread.messages.push({
        id: `${thread.messages.length}`,
        type: 'text',
        sequenceId: `${thread.messages.length}`,
        version: '0',
        content: {
          message: request.content
        },
        senderDisplayName: me.displayName,
        createdOn: new Date(Date.now()),
        sender: getIdentifierKind(me.id)
      });
    });

    const messages = this.checkedGetThread().messages;
    const message = messages[messages.length - 1];
    return Promise.resolve({ id: message.id });
  }

  getMessage(messageId: string): Promise<ChatMessage> {
    const message = this.checkedGetThread().messages.find((m) => m.id === messageId);
    if (!message) {
      throw new Error(`No message ${messageId} in thread ${this.threadId}`);
    }
    return Promise.resolve(message);
  }

  listMessages(options?: ListMessagesOptions): PagedAsyncIterableIterator<ChatMessage> {
    let messages = this.checkedGetThread().messages;
    if (options?.startTime) {
      const startTime = options.startTime;
      // Verify: Does startTime apply to when the message was sent, or last updated?
      messages = messages.filter((m) => m.createdOn > startTime);
    }
    return pagedAsyncIterator(messages);
  }

  deleteMessage(messageId: string): Promise<void> {
    this.modifyThreadForUser((thread) => {
      const message = thread.messages.find((m) => m.id === messageId);
      if (!message) {
        throw new Error(`No message ${messageId} in thread ${thread.id}`);
      }
      message.deletedOn = new Date(Date.now());
    });
    return Promise.resolve();
  }

  updateMessage(messageId: string, options?: UpdateMessageOptions): Promise<void> {
    this.modifyThreadForUser((thread) => {
      const message = thread.messages.find((m) => m.id === messageId);
      if (!message) {
        throw new Error(`No message ${messageId} in thread ${thread.id}`);
      }
      message.content = { message: options?.content };
      message.editedOn = new Date(Date.now());
      bumpMessageVersion(message);
    });
    return Promise.resolve();
  }

  addParticipants(request: AddParticipantsRequest): Promise<AddChatParticipantsResult> {
    // Verify: What happens if an existing participant is added again?
    this.modifyThreadForUser((thread) => {
      thread.participants = thread.participants.concat(request.participants);
    });
    return Promise.resolve({});
  }

  listParticipants(options?: ListParticipantsOptions): PagedAsyncIterableIterator<ChatParticipant> {
    if (options?.skip) {
      throw new Error(`options.skip not supported`);
    }
    return pagedAsyncIterator(this.checkedGetThread().participants);
  }

  removeParticipant(participant: CommunicationIdentifier): Promise<void> {
    const flatParticipantId = toFlatCommunicationIdentifier(participant);
    this.modifyThreadForUser((thread) => {
      const newParticipants = thread.participants.filter(
        (p) => toFlatCommunicationIdentifier(p.id) !== flatParticipantId
      );
      if (newParticipants.length === thread.participants.length) {
        throw new Error(`Participant ${participant} not found in thread ${thread.id}`);
      }
      thread.participants = newParticipants;
    });
    return Promise.resolve();
  }

  sendTypingNotification(): Promise<boolean> {
    return Promise.resolve(false);
  }

  sendReadReceipt(request: SendReadReceiptRequest): Promise<void> {
    this.modifyThreadForUser((thread) => {
      thread.readReceipts.push({
        chatMessageId: request.chatMessageId,
        sender: getIdentifierKind(this.userId),
        readOn: new Date(Date.now())
      });
    });
    return Promise.resolve();
  }

  listReadReceipts(options?: ListReadReceiptsOptions): PagedAsyncIterableIterator<ChatMessageReadReceipt> {
    if (options?.skip) {
      throw new Error(`options.skip not supported`);
    }
    return pagedAsyncIterator(this.checkedGetThread().readReceipts);
  }

  private checkedGetThread(): Thread {
    return this.model.checkedGetThread(this.userId, this.threadId);
  }

  private modifyThreadForUser(action: (thread: Thread) => void) {
    this.model.modifyThreadForUser(this.userId, this.threadId, action);
  }

  private checkedGetThreadEventEmitter(): ThreadEventEmitter {
    return this.model.checkedGetThreadEventEmitter(this.userId, this.threadId);
  }

  private isMe(other: CommunicationIdentifier): boolean {
    return toFlatCommunicationIdentifier(other) === toFlatCommunicationIdentifier(this.userId);
  }

  private checkedGetMe(): ChatParticipant {
    const thread = this.checkedGetThread();
    const me = thread.participants.find((p) => this.isMe(p.id));
    if (!me) {
      throw new Error(`CHECK FAILED: ${this.userId} must be in ${thread.id}`);
    }
    return me;
  }
}
