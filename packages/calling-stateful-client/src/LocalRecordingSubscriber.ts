// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(local-recording-notification) */
import { LocalRecordingCallFeature, LocalRecordingInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(local-recording-notification) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(local-recording-notification) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(local-recording-notification) */
/**
 * @private
 */
export class LocalRecordingSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _recording: LocalRecordingCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, recording: LocalRecordingCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._recording = recording;

    // If recording as already started when we joined the call, make sure it is reflected in state as there may not
    // be an event for it.
    if (this._recording.isRecordingActive) {
      this._context.setCallLocalRecordingActive(this._callIdRef.callId, this._recording.isRecordingActive);
      // recordings getter only returns a list of active recordings, so we can set the list of recordings here
      this._context.setCallLocalRecordingInfos(this._callIdRef.callId, this._recording.recordings, []);
    }

    this.subscribe();
  }

  private subscribe = (): void => {
    this._recording.on('isLocalRecordingActiveChanged', this.isAvailableChanged);
    this._recording.on('localRecordingsUpdated', this.isRecordingsUpdated);
  };

  public unsubscribe = (): void => {
    this._recording.off('isLocalRecordingActiveChanged', this.isAvailableChanged);
    this._recording.off('localRecordingsUpdated', this.isRecordingsUpdated);
  };

  private isAvailableChanged = (): void => {
    this._context.setCallLocalRecordingActive(this._callIdRef.callId, this._recording.isRecordingActive);
  };

  private isRecordingsUpdated = (data: { added: LocalRecordingInfo[]; removed: LocalRecordingInfo[] }): void => {
    this._context.setCallLocalRecordingInfos(this._callIdRef.callId, this._recording.recordings, data.removed);
  };
}
