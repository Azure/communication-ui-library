// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TranscriptionCallFeature } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';

/**
 * @private
 */
export class TranscriptionSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _transcription: TranscriptionCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, transcription: TranscriptionCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._transcription = transcription;

    // If transcription as already started when we joined the call, make sure it is reflected in state as there may not
    // be an event for it.
    if (this._transcription.isTranscriptionActive) {
      this._context.setCallTranscriptionActive(this._callIdRef.callId, this._transcription.isTranscriptionActive);
    }

    this.subscribe();
  }

  private subscribe = (): void => {
    this._transcription.on('isTranscriptionActiveChanged', this.isTranscriptionActiveChanged);
  };

  public unsubscribe = (): void => {
    this._transcription.off('isTranscriptionActiveChanged', this.isTranscriptionActiveChanged);
  };

  private isTranscriptionActiveChanged = (): void => {
    this._context.setCallTranscriptionActive(this._callIdRef.callId, this._transcription.isTranscriptionActive);
  };
}
