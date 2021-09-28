// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RecordingCallFeature } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';

/**
 * @private
 */
export class RecordingSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _recording: RecordingCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, recording: RecordingCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._recording = recording;

    // If recording as already started when we joined the call, make sure it is reflected in state as there may not
    // be an event for it.
    if (this._recording.isRecordingActive) {
      this._context.setCallRecordingActive(this._callIdRef.callId, this._recording.isRecordingActive);
    }

    this.subscribe();
  }

  private subscribe = (): void => {
    this._recording.on('isRecordingActiveChanged', this.isAvailableChanged);
  };

  public unsubscribe = (): void => {
    this._recording.off('isRecordingActiveChanged', this.isAvailableChanged);
  };

  private isAvailableChanged = (): void => {
    this._context.setCallRecordingActive(this._callIdRef.callId, this._recording.isRecordingActive);
  };
}
