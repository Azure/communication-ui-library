// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallCommon } from '@azure/communication-calling';
import EventEmitter from 'events';
import { callEndedSoundString } from '../../common/sounds/CallEndedSound';

type CallingSounds = {
  callEndedSound: HTMLAudioElement;
};

/**
 * @private
 */
export class CallingSoundSubscriber {
  private emitter: EventEmitter;
  private call: CallCommon;
  private sounds: CallingSounds;

  constructor(call: CallCommon, emitter: EventEmitter) {
    console.log('creating calling sounds subscriber');
    this.call = call;
    this.emitter = emitter;
    this.sounds = this.loadSounds();
    this.subscribeCallSoundEvents();
  }

  private onCallStateChanged = (): void => {
    console.log(this.call);
    this.call.on('stateChanged', () => {
      this.emitter.emit('callStateChanged', {
        callState: this.call.state
      });
      if (this.call.state === 'Disconnected') {
        this.sounds.callEndedSound.play();
      }
    });
  };

  private subscribeCallSoundEvents(): void {
    console.log('subscribeCallSoundEvents');
    this.onCallStateChanged();
  }

  public unsubscribeAll(): void {
    this.call.off('stateChanged', this.onCallStateChanged);
  }

  private loadSounds(): CallingSounds {
    const callEndedSound = new Audio(`data:audio/mp3;base64,${callEndedSoundString}`);
    callEndedSound.preload = 'auto';
    return {
      callEndedSound
    };
  }
}
