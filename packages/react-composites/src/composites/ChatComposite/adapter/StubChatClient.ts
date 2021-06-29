// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatClient,
  ChatThreadClient,
  ChatThreadItem,
  CreateChatThreadOptions,
  CreateChatThreadRequest,
  CreateChatThreadResult,
  DeleteChatThreadOptions,
  ListChatThreadsOptions
} from '@azure/communication-chat';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

type PublicInterface<T> = { [K in keyof T]: T[K] };

export class StubChatClient implements PublicInterface<ChatClient> {
  getChatThreadClient(threadId: string): ChatThreadClient {
    // FIXME: Return a stub instead.
    throw Error('stub method not implemented');
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
