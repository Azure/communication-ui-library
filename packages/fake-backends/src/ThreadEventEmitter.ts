// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadDeletedEvent, ChatThreadPropertiesUpdatedEvent } from '@azure/communication-signaling';
import { EventEmitter } from 'events';

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

  public chatThreadPropertiesUpdated(e: ChatThreadPropertiesUpdatedEvent) {
    this.emitter.emit('chatThreadPropertiesUpdated', e);
  }
}
