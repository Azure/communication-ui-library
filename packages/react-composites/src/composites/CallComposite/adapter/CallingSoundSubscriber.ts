// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallCommon } from '@azure/communication-calling';
import EventEmitter from 'events';
import { CallingSounds } from './CallAdapter';

type CallingSoundsLoaded = {
  callEndedSound: HTMLAudioElement | undefined;
};

/**
 * @private
 */
export class CallingSoundSubscriber {
  private emitter: EventEmitter;
  private call: CallCommon;
  sounds?: CallingSounds;
  private soundsLoaded?: CallingSoundsLoaded;

  constructor(call: CallCommon, emitter: EventEmitter, sounds?: CallingSounds) {
    this.call = call;
    this.emitter = emitter;
    this.sounds = sounds;
    if (sounds) {
      this.soundsLoaded = this.loadSounds(sounds);
      this.subscribeCallSoundEvents();
    }
  }

  private onCallStateChanged = (): void => {
    this.call.on('stateChanged', () => {
      this.emitter.emit('callStateChanged', {
        callState: this.call.state
      });
      if (this.call.state === 'Disconnected' && this.soundsLoaded?.callEndedSound) {
        this.soundsLoaded.callEndedSound.play().catch((e) => {
          console.error(e, 'Failed to play call ended sound, check loader config to make sure it is correct');
        });
      }
    });
  };

  private subscribeCallSoundEvents(): void {
    this.onCallStateChanged();
  }

  public unsubscribeAll(): void {
    this.call.off('stateChanged', this.onCallStateChanged);
  }

  private loadSounds(sounds?: CallingSounds): CallingSoundsLoaded | undefined {
    let callEndedSound: HTMLAudioElement | undefined;
    if (sounds?.callEnded) {
      callEndedSound = new Audio(sounds?.callEnded?.path);
      callEndedSound.preload = 'auto';
    }
    return {
      callEndedSound
    };
  }
}
