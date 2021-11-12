// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant, ChatMessage, ChatThreadProperties } from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { EventEmitter } from 'events';
import produce from 'immer';
import { ThreadEventEmitter } from './ThreadEventEmitter';

export class Model {
  private threads: { [key: string]: Thread } = {};
  private threadEventEmitters: { [key: string]: ThreadEventEmitter } = {};

  public addThread(thread: Thread) {
    this.threads[thread.id] = thread;
    this.threadEventEmitters[thread.id] = new ThreadEventEmitter(new EventEmitter());
  }

  public getThreadsForUser(userId: CommunicationIdentifier): Thread[] {
    return Object.values(this.threads).filter((t) => containsUser(userId, t.participants));
  }

  public checkedGetThread(userId: CommunicationIdentifier, threadId: string): Thread {
    const thread = this.threads[threadId];
    if (!thread) {
      throw new Error(`No thread with id ${threadId}`);
    }
    if (!containsUser(userId, thread.participants)) {
      throw new Error(`${userId} is not in thread ${threadId}`);
    }
    return thread;
  }

  public checkedGetThreadEventEmitter(userId: CommunicationIdentifier, threadId: string): ThreadEventEmitter {
    this.checkedGetThread(userId, threadId);
    return this.threadEventEmitters[threadId];
  }

  public modifyThreadForUser(userId: CommunicationIdentifier, threadId: string, action: (t: Thread) => void) {
    const thread = this.checkedGetThread(userId, threadId);
    const newThread = produce(thread, (draft: Thread) => action(thread));
    if (thread !== newThread) {
      this.threads[threadId] = produce(newThread, (draft: Thread) => {
        draft.version++;
      });
    }
  }
}

export interface Thread extends ChatThreadProperties {
  version: number;
  participants: ChatParticipant[];
  messages: ChatMessage[];
}

const containsUser = (userId: CommunicationIdentifier, participants: ChatParticipant[]): boolean => {
  const flatUserId = toFlatCommunicationIdentifier(userId);
  return participants.some((p) => toFlatCommunicationIdentifier(p.id) === flatUserId);
};
