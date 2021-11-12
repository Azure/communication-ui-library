// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant, ChatMessage, ChatThreadProperties } from '@azure/communication-chat';
import { ChatThreadDeletedEvent, CommunicationIdentifier } from '@azure/communication-signaling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { EventEmitter } from 'events';

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
    action(thread);
    // TODO: Only bump version when there is a change.
    thread.version++;
  }
}

export interface Thread extends ChatThreadProperties {
  version: number;
  participants: ChatParticipant[];
  messages: ChatMessage[];
}

export const latestMessageTimestamp = (messages: ChatMessage[]): Date | undefined => {
  if (messages.length === 0) {
    return undefined;
  }
  return messages[messages.length - 1].createdOn;
};

export class ThreadEventEmitter {
  constructor(private emitter: EventEmitter) {}

  public on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }

  public off(event: string, listener: (...args: any[]) => void) {
    this.emitter.off(event, listener);
  }

  public chatThreadDeleted(e: ChatThreadDeletedEvent) {
    this.emitter.emit('chatThreadDeleted', e);
  }
}

const containsUser = (userId: CommunicationIdentifier, participants: ChatParticipant[]): boolean => {
  const flatUserId = toFlatCommunicationIdentifier(userId);
  return participants.some((p) => toFlatCommunicationIdentifier(p.id) === flatUserId);
};
