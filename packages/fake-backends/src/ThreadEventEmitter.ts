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
import { Thread } from './types';

export class ThreadEventEmitter {
  private emitters: { [key: string]: EventEmitter } = {};

  constructor(private async = true) {}

  on(userId: CommunicationIdentifier, event: string, listener: (...args: any[]) => void) {
    this.getOrCreateEmitter(userId).on(event, listener);
  }

  off(userId: CommunicationIdentifier, event: string, listener: (...args: any[]) => void) {
    this.getOrCreateEmitter(userId).off(event, listener);
  }

  chatMessageReceived(targets: CommunicationIdentifier[], e: ChatMessageReceivedEvent) {
    this.emit(targets, 'chatMessageReceived', e);
  }
  chatMessageEdited(targets: CommunicationIdentifier[], e: ChatMessageEditedEvent) {
    this.emit(targets, 'chatMessageEdited', e);
  }
  chatMessageDeleted(targets: CommunicationIdentifier[], e: ChatMessageDeletedEvent) {
    this.emit(targets, 'chatMessageDeleted', e);
  }
  typingIndicatorReceived(targets: CommunicationIdentifier[], e: TypingIndicatorReceivedEvent) {
    this.emit(targets, 'typingIndicatorReceived', e);
  }
  readReceiptReceived(targets: CommunicationIdentifier[], e: ReadReceiptReceivedEvent) {
    this.emit(targets, 'readReceiptReceived', e);
  }
  chatThreadCreated(targets: CommunicationIdentifier[], e: ChatThreadCreatedEvent) {
    this.emit(targets, 'chatThreadCreated', e);
  }
  chatThreadDeleted(targets: CommunicationIdentifier[], e: ChatThreadDeletedEvent) {
    this.emit(targets, 'chatThreadDeleted', e);
  }
  chatThreadPropertiesUpdated(targets: CommunicationIdentifier[], e: ChatThreadPropertiesUpdatedEvent) {
    this.emit(targets, 'chatThreadPropertiesUpdated', e);
  }
  participantsAdded(targets: CommunicationIdentifier[], e: ParticipantsAddedEvent) {
    this.emit(targets, 'participantsAdded', e);
  }
  participantsRemoved(targets: CommunicationIdentifier[], e: ParticipantsRemovedEvent) {
    this.emit(targets, 'participantsRemoved', e);
  }

  private getOrCreateEmitter(userId: CommunicationIdentifier): EventEmitter {
    const flatUserId = toFlatCommunicationIdentifier(userId);
    if (!this.emitters[flatUserId]) {
      this.emitters[flatUserId] = new EventEmitter();
    }
    return this.emitters[flatUserId];
  }

  private emit(targets: CommunicationIdentifier[], event: string, payload: any) {
    targets.forEach((target) => {
      const emitter = this.emitters[toFlatCommunicationIdentifier(target)];
      if (!emitter) {
        // Possible if this target never subscribed to any events.
        return;
      }
      if (this.async) {
        setImmediate(() => {
          emitter.emit(event, payload);
        });
      } else {
        emitter.emit(event, payload);
      }
    });
  }
}

export const getThreadEventTargets = (
  thread: Thread,
  localUserId: CommunicationIdentifier
): CommunicationIdentifier[] => {
  const flatLocalUserId = toFlatCommunicationIdentifier(localUserId);
  return thread.participants.filter((p) => toFlatCommunicationIdentifier(p.id) !== flatLocalUserId).map((p) => p.id);
};
