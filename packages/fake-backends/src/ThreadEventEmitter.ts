// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
import { EventEmitter } from 'events';

export class ThreadEventEmitter {
  constructor(private emitter: EventEmitter, private async = true) {}

  on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }

  off(event: string, listener: (...args: any[]) => void) {
    this.emitter.off(event, listener);
  }

  chatMessageReceived(e: ChatMessageReceivedEvent) {
    this.emit('chatMessageReceived', e);
  }
  chatMessageEdited(e: ChatMessageEditedEvent) {
    this.emit('chatMessageEdited', e);
  }
  chatMessageDeleted(e: ChatMessageDeletedEvent) {
    this.emit('chatMessageDeleted', e);
  }
  typingIndicatorReceived(e: TypingIndicatorReceivedEvent) {
    this.emit('typingIndicatorReceived', e);
  }
  readReceiptReceived(e: ReadReceiptReceivedEvent) {
    this.emit('readReceiptReceived', e);
  }
  chatThreadCreated(e: ChatThreadCreatedEvent) {
    this.emit('chatThreadCreated', e);
  }
  chatThreadDeleted(e: ChatThreadDeletedEvent) {
    this.emit('chatThreadDeleted', e);
  }
  chatThreadPropertiesUpdated(e: ChatThreadPropertiesUpdatedEvent) {
    this.emit('chatThreadPropertiesUpdated', e);
  }
  participantsAdded(e: ParticipantsAddedEvent) {
    this.emit('participantsAdded', e);
  }
  participantsRemoved(e: ParticipantsRemovedEvent) {
    this.emit('participantsRemoved', e);
  }

  private emit(event: string, payload: any) {
    if (this.async) {
      setImmediate(() => {
        this.emitter.emit(event, payload);
      });
    } else {
      this.emitter.emit(event, payload);
    }
  }
}
