// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { VideoEffectErrorPayload, VideoEffectsFeature } from '@azure/communication-calling';

import { LocalVideoStreamState } from './CallClientState';

import { CallContext } from './CallContext';

import { CallIdRef } from './CallIdRef';

import { convertFromSDKToDeclarativeVideoStreamVideoEffects } from './Converter';

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

  private effectsStarted = (): void => {
    this.updateStatefulVideoEffects();
  };

  private effectsStopped = (): void => {
    this.updateStatefulVideoEffects();
  };

  private effectsError = (error: VideoEffectErrorPayload): void => {
    // When there is an error the effects have stopped. Ensure state is updated to reflect if effects are active or not.
    this.updateStatefulVideoEffects();
    this._context.teeErrorToState(new Error(error.message), 'VideoEffectsFeature.startEffects');
  };

  private updateStatefulVideoEffects = (): void => {
    const statefulVideoEffects = convertFromSDKToDeclarativeVideoStreamVideoEffects(
      this._localVideoStreamEffectsAPI.activeEffects
    );
    if (this._parent === 'unparented') {
      this._context.setDeviceManagerUnparentedViewVideoEffects(this._localVideoStream, statefulVideoEffects);
    } else {
      this._context.setCallLocalVideoStreamVideoEffects(this._parent.callId, statefulVideoEffects);
    }
  };
}
