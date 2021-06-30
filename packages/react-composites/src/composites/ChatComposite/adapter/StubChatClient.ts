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
    return Promise.resolve({});
  }
  listChatThreads(options?: ListChatThreadsOptions): PagedAsyncIterableIterator<ChatThreadItem> {
    return pagedAsyncIterator([]);
  }
  deleteChatThread(threadId: string, options?: DeleteChatThreadOptions): Promise<void> {
    return Promise.resolve();
  }
  startRealtimeNotifications(): Promise<void> {
    return Promise.resolve();
  }
  stopRealtimeNotifications(): Promise<void> {
    return Promise.resolve();
  }
  on(event: string, listener: (e: any) => void): void {
    return;
  }
  off(event: string, listener: (e: any) => void): void {
    return;
  }
}

export class StubChatThreadClient implements PublicInterface<ChatThreadClient> {
  readonly threadId: string;

  constructor(threadId?: string) {
    this.threadId = threadId ?? '';
  }
  getProperties(options?: GetPropertiesOptions): Promise<ChatThreadProperties> {
    return Promise.resolve({ id: '', topic: '', createdOn: new Date(0) });
  }
  updateTopic(topic: string, options?: UpdateTopicOptions): Promise<void> {
    return Promise.resolve();
  }
  sendMessage(request: SendMessageRequest, options?: SendMessageOptions): Promise<SendChatMessageResult> {
    return Promise.resolve({ id: '' });
  }
  getMessage(messageId: string, options?: GetMessageOptions): Promise<ChatMessage> {
    return Promise.resolve({ id: '', type: 'text', sequenceId: '', version: '', createdOn: new Date(0) });
  }
  listMessages(options?: ListMessagesOptions): PagedAsyncIterableIterator<ChatMessage> {
    return pagedAsyncIterator([]);
  }
  deleteMessage(messageId: string, options?: DeleteMessageOptions): Promise<void> {
    return Promise.resolve();
  }
  updateMessage(messageId: string, options?: UpdateMessageOptions): Promise<void> {
    return Promise.resolve();
  }
  addParticipants(
    request: AddParticipantsRequest,
    options?: AddParticipantsOptions
  ): Promise<AddChatParticipantsResult> {
    return Promise.resolve({});
  }
  listParticipants(options?: ListParticipantsOptions): PagedAsyncIterableIterator<ChatParticipant> {
    return pagedAsyncIterator([]);
  }
  removeParticipant(participant: CommunicationIdentifier, options?: RemoveParticipantOptions): Promise<void> {
    return Promise.resolve();
  }
  sendTypingNotification(options?: SendTypingNotificationOptions): Promise<boolean> {
    return Promise.resolve(false);
  }
  sendReadReceipt(request: SendReadReceiptRequest, options?: SendReadReceiptOptions): Promise<void> {
    return Promise.resolve();
  }
  listReadReceipts(options?: ListReadReceiptsOptions): PagedAsyncIterableIterator<ChatMessageReadReceipt> {
    return pagedAsyncIterator([]);
  }
}

export const pagedAsyncIterator = <T>(values: T[]): PagedAsyncIterableIterator<T, T[]> => {
  async function* listAll(values: T[]): AsyncIterableIterator<T> {
    yield* values;
  }

  async function* listByPage(): AsyncIterableIterator<T[]> {
    yield* [values];
  }

  const iter = listAll(values);

  return {
    next(): Promise<IteratorResult<T, T>> {
      return iter.next();
    },
    [Symbol.asyncIterator]() {
      return this;
    },
    byPage: () => {
      return listByPage();
    }
  };
};
