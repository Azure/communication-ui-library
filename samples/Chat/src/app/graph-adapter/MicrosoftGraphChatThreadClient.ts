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
  SendTypingNotificationOptions,
  UpdateMessageOptions
} from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { Model } from './Model';
import { IChatThreadClient, Thread } from './types';
import { pagedAsyncIterator } from './utils';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * A Microsoft Graph implementation of a ChatThreadClient.
 */
export class MicrosoftGraphChatThreadClient implements IChatThreadClient {
  constructor(private model: Model, public threadId: string) {}

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
    throw new Error('MicrosoftGraphChatThreadClient topic Not implemented');
  }

  sendMessage(request: SendMessageRequest): Promise<SendChatMessageResult> {
    throw new Error('MicrosoftGraphChatThreadClient sendMessage Not implemented');
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
    throw new Error('MicrosoftGraphChatThreadClient deleteMessage Not implemented');
  }

  updateMessage(messageId: string, options?: UpdateMessageOptions): Promise<void> {
    throw new Error('MicrosoftGraphChatThreadClient updateMessage Not implemented');
  }

  addParticipants(request: AddParticipantsRequest): Promise<AddChatParticipantsResult> {
    throw new Error('MicrosoftGraphChatThreadClient addParticipants Not implemented');
  }

  listParticipants(options?: ListParticipantsOptions): PagedAsyncIterableIterator<ChatParticipant> {
    if (options?.skip) {
      throw new Error(`options.skip not supported`);
    }
    return pagedAsyncIterator(this.checkedGetThread().participants);
  }

  removeParticipant(participant: CommunicationIdentifier): Promise<void> {
    throw new Error('MicrosoftGraphChatThreadClient removeParticipant Not implemented');
  }

  sendTypingNotification(options?: SendTypingNotificationOptions): Promise<boolean> {
    console.error('MicrosoftGraphChatThreadClient sendTypingNotification Not implemented');
    return Promise.resolve(true);
  }

  sendReadReceipt(request: SendReadReceiptRequest): Promise<void> {
    console.error('MicrosoftGraphChatThreadClient  Not implemented');
    return Promise.resolve();
  }

  listReadReceipts(options?: ListReadReceiptsOptions): PagedAsyncIterableIterator<ChatMessageReadReceipt> {
    if (options?.skip) {
      throw new Error(`options.skip not supported`);
    }
    return pagedAsyncIterator(this.checkedGetThread().readReceipts);
  }

  private checkedGetThread(): Thread {
    const thread = this.model.getThread(this.threadId);
    if (!thread) {
      throw new Error(`Thread not found! (${this.threadId})}`);
    }
    return thread;
  }
}
