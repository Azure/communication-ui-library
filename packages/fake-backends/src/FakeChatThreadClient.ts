// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AddChatParticipantsResult,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadProperties,
  SendChatMessageResult
} from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { Model, Thread } from './Model';
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
