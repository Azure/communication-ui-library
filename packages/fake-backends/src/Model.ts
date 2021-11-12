// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant, ChatMessage, ChatThreadProperties } from '@azure/communication-chat';
import { ChatThreadDeletedEvent } from '@azure/communication-signaling';
import { EventEmitter } from 'events';

export interface Model {
  threads: Thread[];
}

export interface Thread extends ChatThreadProperties {
  version: number;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  emitter: ThreadEventEmitter;
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
