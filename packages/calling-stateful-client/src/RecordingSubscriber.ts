// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RecordingCallFeature } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(local-recording-notification) */
import { RecordingInfo } from '@azure/communication-calling';

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
      /* @conditional-compile-remove(local-recording-notification) */
      // recordings getter only returns a list of active recordings, so we can set the list of recordings here
      this._context.setCallRecordingInfos(this._callIdRef.callId, this._recording.recordings, []);
    }

    this.subscribe();
  }

  private subscribe = (): void => {
    this._recording.on('isRecordingActiveChanged', this.isAvailableChanged);
    /* @conditional-compile-remove(local-recording-notification) */
    this._recording.on('recordingsUpdated', this.isRecordingsUpdated);
  };

  public unsubscribe = (): void => {
    this._recording.off('isRecordingActiveChanged', this.isAvailableChanged);
    /* @conditional-compile-remove(local-recording-notification) */
    this._recording.off('recordingsUpdated', this.isRecordingsUpdated);
  };

  private isAvailableChanged = (): void => {
    this._context.setCallRecordingActive(this._callIdRef.callId, this._recording.isRecordingActive);
  };

  /* @conditional-compile-remove(local-recording-notification) */
  private isRecordingsUpdated = (data: { added: RecordingInfo[]; removed: RecordingInfo[] }): void => {
    this._context.setCallRecordingInfos(this._callIdRef.callId, this._recording.recordings, data.removed);
  };
}
