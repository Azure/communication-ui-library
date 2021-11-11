// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { nanoid } from 'nanoid';
import {
  AddChatParticipantsResult,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadClient,
  ChatThreadItem,
  ChatThreadProperties,
  CreateChatThreadRequest,
  CreateChatThreadOptions,
  CreateChatThreadResult,
  SendChatMessageResult
} from '@azure/communication-chat';
import { CommunicationIdentifier, getIdentifierKind } from '@azure/communication-common';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Model } from './Model';
import { IChatClient, IChatThreadClient } from './types';

/**
 * A public interface compatible stub for ChatClient.
 */
export class FakeChatClient implements IChatClient {
  constructor(private model: Model, private id: CommunicationIdentifier) {}

  getChatThreadClient(): ChatThreadClient {
    throw Error('stub method not implemented');
  }
  createChatThread(
    request: CreateChatThreadRequest,
    options?: CreateChatThreadOptions
  ): Promise<CreateChatThreadResult> {
    const participants = this.ensureCurrentUserInThread(options?.participants ?? []);
    const thread = {
      id: nanoid(),
      createdOn: new Date(Date.now()),
      createdBy: this.id,
      topic: request.topic,
      participants
    };
    this.model.threads.push(thread);
    return Promise.resolve({
      chatThread: {
        id: thread.id,
        createdOn: thread.createdOn,
        createdBy: getIdentifierKind(thread.createdBy),
        topic: thread.topic
      }
    });
  }

  private ensureCurrentUserInThread(participants: ChatParticipant[]): ChatParticipant[] {
    const me = toFlatCommunicationIdentifier(this.id);
    for (const participant of participants) {
      if (toFlatCommunicationIdentifier(participant.id) === me) {
        return participants;
      }
    }
    return [...participants, { id: this.id }];
  }
  listChatThreads(): PagedAsyncIterableIterator<ChatThreadItem> {
    return pagedAsyncIterator([]);
  }
  deleteChatThread(): Promise<void> {
    return Promise.resolve();
  }
  startRealtimeNotifications(): Promise<void> {
    return Promise.resolve();
  }
  stopRealtimeNotifications(): Promise<void> {
    return Promise.resolve();
  }
  on(): void {
    return;
  }
  off(): void {
    return;
  }
}

/**
 * A public interface compatible stub for ChatThreadClient.
 */
export class FakeChatThreadClient implements IChatThreadClient {
  readonly threadId: string;

  constructor(threadId?: string) {
    this.threadId = threadId ?? '';
  }
  getProperties(): Promise<ChatThreadProperties> {
    return Promise.resolve({ id: '', topic: '', createdOn: new Date(0) });
  }
  updateTopic(): Promise<void> {
    return Promise.resolve();
  }
  sendMessage(): Promise<SendChatMessageResult> {
    return Promise.resolve({ id: '' });
  }
  getMessage(): Promise<ChatMessage> {
    return Promise.resolve({ id: '', type: 'text', sequenceId: '', version: '', createdOn: new Date(0) });
  }
  listMessages(): PagedAsyncIterableIterator<ChatMessage> {
    return pagedAsyncIterator([]);
  }
  deleteMessage(): Promise<void> {
    return Promise.resolve();
  }
  updateMessage(): Promise<void> {
    return Promise.resolve();
  }
  addParticipants(): Promise<AddChatParticipantsResult> {
    return Promise.resolve({});
  }
  listParticipants(): PagedAsyncIterableIterator<ChatParticipant> {
    return pagedAsyncIterator([]);
  }
  removeParticipant(): Promise<void> {
    return Promise.resolve();
  }
  sendTypingNotification(): Promise<boolean> {
    return Promise.resolve(false);
  }
  sendReadReceipt(): Promise<void> {
    return Promise.resolve();
  }
  listReadReceipts(): PagedAsyncIterableIterator<ChatMessageReadReceipt> {
    return pagedAsyncIterator([]);
  }
}

/**
 * A paged async operator that asynchronously iterates over values in an array.
 * In paging mode, the whole array is returned as a single page, ignoring all page size options.
 */
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

/**
 * An iterator that throws the given error when asynchronously iterating over items, directly or byPage.
 */
export const failingPagedAsyncIterator = <T>(error: Error): PagedAsyncIterableIterator<T, T[]> => {
  return {
    async next() {
      throw error;
    },
    [Symbol.asyncIterator]() {
      return this;
    },
    byPage: (): AsyncIterableIterator<T[]> => {
      return {
        async next() {
          throw error;
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
  };
};
