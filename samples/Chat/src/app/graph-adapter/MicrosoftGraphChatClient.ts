// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatThreadClient,
  ChatThreadItem,
  CreateChatThreadRequest,
  CreateChatThreadOptions,
  CreateChatThreadResult
} from '@azure/communication-chat';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { Model } from './Model';
import { IChatClient, IChatThreadClient } from './types';
import { MicrosoftGraphChatThreadClient } from './MicrosoftGraphChatThreadClient';
import { pagedAsyncIterator, latestMessageTimestamp } from './utils';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * A MicrosoftGraph implementation of a ChatClient.
 */
export class MicrosoftGraphChatClient implements IChatClient {
  private realtimeNotificationsEnabled = false;
  private threadClients: MicrosoftGraphChatThreadClient[] = [];

  constructor(private model: Model) {}

  getChatThreadClient(threadId: string): ChatThreadClient {
    this.model.getThread(threadId);
    const threadClient = new MicrosoftGraphChatThreadClient(this.model, threadId);
    this.threadClients.push(threadClient);
    return threadClient as IChatThreadClient as ChatThreadClient;
  }

  createChatThread(
    request: CreateChatThreadRequest,
    options?: CreateChatThreadOptions
  ): Promise<CreateChatThreadResult> {
    throw new Error('MicrosoftGraphChatClient createChatThread Not Implemented');
  }

  listChatThreads(): PagedAsyncIterableIterator<ChatThreadItem> {
    const threads = this.model.getAllThreads();
    const response: ChatThreadItem[] = threads.map((t) => ({
      id: t.id,
      topic: t.topic,
      lastMessageReceivedOn: latestMessageTimestamp(t.messages)
    }));
    return pagedAsyncIterator(response);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteChatThread(threadId: string): Promise<void> {
    throw new Error('MicrosoftGraphChatClient deleteChatThread Not Implemented');
  }

  startRealtimeNotifications(): Promise<void> {
    this.realtimeNotificationsEnabled = true;
    return Promise.resolve();
  }

  stopRealtimeNotifications(): Promise<void> {
    this.realtimeNotificationsEnabled = false;
    // TODO unsubscribe from all events.
    throw new Error('MicrosoftGraphChatClient stopRealtimeNotifications Not Implemented');
  }

  on(event: string, listener: any): void {
    console.error('MicrosoftGraphChatClient on Not implemented');
  }

  off(): void {
    console.error('MicrosoftGraphChatClient off Not implemented');
  }
}
