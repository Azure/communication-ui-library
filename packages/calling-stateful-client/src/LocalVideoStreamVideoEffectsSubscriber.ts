// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(video-background-effects) */
import { VideoEffectErrorPayload, VideoEffectName, VideoEffectsFeature } from '@azure/communication-calling';
/* @conditional-compile-remove(video-background-effects) */
import { LocalVideoStreamState } from './CallClientState';
/* @conditional-compile-remove(video-background-effects) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(video-background-effects) */
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(video-background-effects) */
import { convertFromSDKToDeclarativeVideoStreamVideoEffects } from './Converter';

/* @conditional-compile-remove(video-background-effects) */
/**
 * Subscribes to a LocalVideoStream's video effects events and updates the call context appropriately.
 * @private
 */
export class LocalVideoStreamVideoEffectsSubscriber {
  private _parent: CallIdRef | 'unparented';
  private _context: CallContext;
  private _localVideoStream: LocalVideoStreamState;
  private _localVideoStreamEffectsAPI: VideoEffectsFeature;

  constructor(args: {
    /** Owner of the local video stream. This is either the Call (referenced by CallIdRef) or is the device manager's unparented view (referenced by 'unparented') */
    parent: CallIdRef | 'unparented';
    context: CallContext;
    localVideoStream: LocalVideoStreamState;
    localVideoStreamEffectsAPI: VideoEffectsFeature;
  }) {
    this._parent = args.parent;
    this._context = args.context;
    this._localVideoStream = args.localVideoStream;
    this._localVideoStreamEffectsAPI = args.localVideoStreamEffectsAPI;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._localVideoStreamEffectsAPI.on('effectsStarted', this.effectsStarted);
    this._localVideoStreamEffectsAPI.on('effectsStopped', this.effectsStopped);
    this._localVideoStreamEffectsAPI.on('effectsError', this.effectsError);
  };

  public unsubscribe = (): void => {
    this._localVideoStreamEffectsAPI.off('effectsStarted', this.effectsStarted);
    this._localVideoStreamEffectsAPI.off('effectsStopped', this.effectsStopped);
    this._localVideoStreamEffectsAPI.off('effectsError', this.effectsError);
  };

  private effectsStarted = (effects: VideoEffectName[]): void => {
    // TODO: support multiple effects
    this.updateEffectsState(effects[0]);
  };

  private effectsStopped = (): void => {
    this.updateEffectsState(undefined);
  };

  private effectsError = (error: VideoEffectErrorPayload): void => {
    // When there is an error the effects have stopped. Update the state to reflect this.
    this.updateEffectsState(undefined);
    this._context.teeErrorToState(new Error(error.message), 'VideoEffectsFeature.startEffects');
  };

  private updateEffectsState = (newEffect: VideoEffectName | undefined): void => {
    const statefulVideoEffect = newEffect && convertFromSDKToDeclarativeVideoStreamVideoEffects(newEffect);
    if (this._parent === 'unparented') {
      this._context.setDeviceManagerUnparentedViewVideoEffects(this._localVideoStream, statefulVideoEffect);
    } else {
      this._context.setCallLocalVideoStreamVideoEffects(this._parent.callId, statefulVideoEffect);
    }
  };
}
