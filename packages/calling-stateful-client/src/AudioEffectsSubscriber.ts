// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(DNS) */
import { AudioEffectsFeature } from '@azure/communication-calling';
/* @conditional-compile-remove(DNS) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(DNS) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(DNS) */
/**
 * @private
 */
export class AudioEffectsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _audioEffects: AudioEffectsFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, audioEffects: AudioEffectsFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._audioEffects = audioEffects;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._audioEffects.on('effectsStarted', this.onAudioEffectsChanged);
    this._audioEffects.on('effectsStopped', this.onAudioEffectsChanged);
  };

  public unsubscribe = (): void => {
    this._audioEffects.off('effectsStarted', this.onAudioEffectsChanged);
    this._audioEffects.off('effectsStopped', this.onAudioEffectsChanged);
  };

  private onAudioEffectsChanged = (): void => {
    this._context.setActiveAudioEffects(this._callIdRef.callId, this._audioEffects);
  };
}
