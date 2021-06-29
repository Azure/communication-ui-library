// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AddChatParticipantsResult,
  AddParticipantsOptions,
  AddParticipantsRequest,
  ChatClient,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadClient,
  ChatThreadItem,
  ChatThreadProperties,
  CreateChatThreadOptions,
  CreateChatThreadRequest,
  CreateChatThreadResult,
  DeleteChatThreadOptions,
  DeleteMessageOptions,
  GetMessageOptions,
  GetPropertiesOptions,
  ListChatThreadsOptions,
  ListMessagesOptions,
  ListReadReceiptsOptions,
  ListParticipantsOptions,
  RemoveParticipantOptions,
  SendChatMessageResult,
  SendMessageOptions,
  SendMessageRequest,
  SendReadReceiptOptions,
  SendReadReceiptRequest,
  SendTypingNotificationOptions,
  UpdateMessageOptions,
  UpdateTopicOptions
} from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

type PublicInterface<T> = { [K in keyof T]: T[K] };

export class StubChatClient implements PublicInterface<ChatClient> {
  private threadClient;

  /**
   * @param threadClient If set, an implementation of ChatThreadClient interface that is returned for *all* calls to
   * {@getChatThreadClient()}.
   */
  constructor(threadClient?: PublicInterface<ChatThreadClient>) {
    this.threadClient = threadClient;
  }

  getChatThreadClient(threadId: string): ChatThreadClient {
    if (this.threadClient === undefined) {
      throw Error('stub method not implemented');
    }
    return this.threadClient;
  }
  createChatThread(
    request: CreateChatThreadRequest,
    options?: CreateChatThreadOptions
  ): Promise<CreateChatThreadResult> {
    throw Error('stub method not implemented');
  }
  listChatThreads(options?: ListChatThreadsOptions): PagedAsyncIterableIterator<ChatThreadItem> {
    throw Error('stub method not implemented');
  }
  deleteChatThread(threadId: string, options?: DeleteChatThreadOptions): Promise<void> {
    throw Error('stub method not implemented');
  }
  startRealtimeNotifications(): Promise<void> {
    throw Error('stub method not implemented');
  }
  stopRealtimeNotifications(): Promise<void> {
    throw Error('stub method not implemented');
  }
  on(event: string, listener: (e: any) => void): void {
    throw Error('stub method not implemented');
  }
  off(event: string, listener: (e: any) => void): void {
    throw Error('stub method not implemented');
  }
}

export class StubChatThreadClient implements PublicInterface<ChatThreadClient> {
  readonly threadId: string;

  constructor(threadId?: string) {
    this.threadId = threadId ?? '';
  }
  getProperties(options?: GetPropertiesOptions): Promise<ChatThreadProperties> {
    throw Error('stub method not implemented');
  }
  updateTopic(topic: string, options?: UpdateTopicOptions): Promise<void> {
    throw Error('stub method not implemented');
  }
  sendMessage(request: SendMessageRequest, options?: SendMessageOptions): Promise<SendChatMessageResult> {
    throw Error('stub method not implemented');
  }
  getMessage(messageId: string, options?: GetMessageOptions): Promise<ChatMessage> {
    throw Error('stub method not implemented');
  }
  listMessages(options?: ListMessagesOptions): PagedAsyncIterableIterator<ChatMessage> {
    throw Error('stub method not implemented');
  }
  deleteMessage(messageId: string, options?: DeleteMessageOptions): Promise<void> {
    throw Error('stub method not implemented');
  }
  updateMessage(messageId: string, options?: UpdateMessageOptions): Promise<void> {
    throw Error('stub method not implemented');
  }
  addParticipants(
    request: AddParticipantsRequest,
    options?: AddParticipantsOptions
  ): Promise<AddChatParticipantsResult> {
    throw Error('stub method not implemented');
  }
  listParticipants(options?: ListParticipantsOptions): PagedAsyncIterableIterator<ChatParticipant> {
    throw Error('stub method not implemented');
  }
  removeParticipant(participant: CommunicationIdentifier, options?: RemoveParticipantOptions): Promise<void> {
    throw Error('stub method not implemented');
  }
  sendTypingNotification(options?: SendTypingNotificationOptions): Promise<boolean> {
    throw Error('stub method not implemented');
  }
  sendReadReceipt(request: SendReadReceiptRequest, options?: SendReadReceiptOptions): Promise<void> {
    throw Error('stub method not implemented');
  }
  listReadReceipts(options?: ListReadReceiptsOptions): PagedAsyncIterableIterator<ChatMessageReadReceipt> {
    throw Error('stub method not implemented');
  }
}
