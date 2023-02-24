// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifier } from '@azure/communication-common';
import {
  ChatMessageDeletedEvent,
  ChatMessageEditedEvent,
  ChatMessageReceivedEvent,
  ChatThreadCreatedEvent,
  ChatThreadDeletedEvent,
  ChatThreadPropertiesUpdatedEvent,
  ParticipantsAddedEvent,
  ParticipantsRemovedEvent,
  ReadReceiptReceivedEvent,
  TypingIndicatorReceivedEvent
} from '@azure/communication-signaling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { EventEmitter } from 'events';
import { NetworkEventModel, Thread } from './types';

export class ThreadEventEmitter {
  private emitters: { [key: string]: EventEmitter } = {};
  private eventQueue: EventPayload[] = [];
  private networkModel: NetworkEventModel;

  constructor(networkModel: NetworkEventModel) {
    this.networkModel = networkModel;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(userId: CommunicationIdentifier, event: string, listener: (...args: any[]) => void): void {
    this.getOrCreateEmitter(userId).on(event, listener);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(userId: CommunicationIdentifier, event: string, listener: (...args: any[]) => void): void {
    this.getOrCreateEmitter(userId).off(event, listener);
  }

  chatMessageReceived(targets: CommunicationIdentifier[], e: ChatMessageReceivedEvent): void {
    this.emit(targets, 'chatMessageReceived', e);
  }
  chatMessageEdited(targets: CommunicationIdentifier[], e: ChatMessageEditedEvent): void {
    this.emit(targets, 'chatMessageEdited', e);
  }
  chatMessageDeleted(targets: CommunicationIdentifier[], e: ChatMessageDeletedEvent): void {
    this.emit(targets, 'chatMessageDeleted', e);
  }
  typingIndicatorReceived(targets: CommunicationIdentifier[], e: TypingIndicatorReceivedEvent): void {
    this.emit(targets, 'typingIndicatorReceived', e);
  }
  readReceiptReceived(targets: CommunicationIdentifier[], e: ReadReceiptReceivedEvent): void {
    this.emit(targets, 'readReceiptReceived', e);
  }
  chatThreadCreated(targets: CommunicationIdentifier[], e: ChatThreadCreatedEvent): void {
    this.emit(targets, 'chatThreadCreated', e);
  }
  chatThreadDeleted(targets: CommunicationIdentifier[], e: ChatThreadDeletedEvent): void {
    this.emit(targets, 'chatThreadDeleted', e);
  }
  chatThreadPropertiesUpdated(targets: CommunicationIdentifier[], e: ChatThreadPropertiesUpdatedEvent): void {
    this.emit(targets, 'chatThreadPropertiesUpdated', e);
  }
  participantsAdded(targets: CommunicationIdentifier[], e: ParticipantsAddedEvent): void {
    this.emit(targets, 'participantsAdded', e);
  }
  participantsRemoved(targets: CommunicationIdentifier[], e: ParticipantsRemovedEvent): void {
    this.emit(targets, 'participantsRemoved', e);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private emit(targets: CommunicationIdentifier[], event: string, payload: any): void {
    targets.forEach((target) => {
      const emitter = this.emitters[toFlatCommunicationIdentifier(target)];
      if (!emitter) {
        // Possible if this target never subscribed to any events.
        return;
      }

      this.eventQueue.push({ emitter, event, payload });

      if (this.networkModel.asyncDelivery) {
        setTimeout(() => this.dispatchOneEvent(), Math.random() * (this.networkModel.maxDelayMilliseconds ?? 0));
      } else {
        this.dispatchOneEvent();
      }
    });
  }

  private dispatchOneEvent(): void {
    if (this.eventQueue.length === 0) {
      throw new Error(`queue must not be empty`);
    }
    const event = this.eventQueue[0];
    this.eventQueue = this.eventQueue.slice(1);
    event.emitter.emit(event.event, event.payload);
  }

  private getOrCreateEmitter(userId: CommunicationIdentifier): EventEmitter {
    const flatUserId = toFlatCommunicationIdentifier(userId);
    if (!this.emitters[flatUserId]) {
      this.emitters[flatUserId] = new EventEmitter();
    }
    return this.emitters[flatUserId];
  }
}

interface EventPayload {
  emitter: EventEmitter;
  event: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export const getThreadEventTargets = (
  thread: Thread,
  localUserId: CommunicationIdentifier
): CommunicationIdentifier[] => {
  const flatLocalUserId = toFlatCommunicationIdentifier(localUserId);
  return thread.participants.filter((p) => toFlatCommunicationIdentifier(p.id) !== flatLocalUserId).map((p) => p.id);
};
