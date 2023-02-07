// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant, ChatMessage } from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import produce from 'immer';
import { ThreadEventEmitter } from './ThreadEventEmitter';
import { NetworkEventModel, Thread } from './types';

export class Model {
  private threadMap: Record<string, { thread: Thread; eventEmitter: ThreadEventEmitter }> = {};
  private networkEventModel: NetworkEventModel;

  constructor(networkEventModel: NetworkEventModel) {
    this.networkEventModel = networkEventModel;
  }

  public addThread(thread: Thread): void {
    this.threadMap[thread.id] = { thread, eventEmitter: new ThreadEventEmitter(this.networkEventModel) };
  }

  public getThreadsForUser(userId: CommunicationIdentifier): Thread[] {
    return Object.values(this.threadMap)
      .map((t) => t.thread)
      .filter((t) => containsUser(userId, t.participants));
  }

  public checkedGetThread(userId: CommunicationIdentifier, threadId: string): Thread {
    const thread = this.threadMap[threadId].thread;
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
    return this.threadMap[threadId].eventEmitter;
  }

  public modifyThreadForUser(userId: CommunicationIdentifier, threadId: string, action: (t: Thread) => void): void {
    const thread = this.checkedGetThread(userId, threadId);
    const newThread = produce(thread, (draft: Thread) => action(draft));
    if (thread !== newThread) {
      this.threadMap[threadId].thread = produce(newThread, (draft) => {
        draft.version++;
      });
    }
  }
}

export const bumpMessageVersion = (message: ChatMessage): void => {
  message.version = `${parseInt(message.version) + 1}`;
};

const containsUser = (userId: CommunicationIdentifier, participants: ChatParticipant[]): boolean => {
  const flatUserId = toFlatCommunicationIdentifier(userId);
  return participants.some((p) => toFlatCommunicationIdentifier(p.id) === flatUserId);
};
