// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallCommon } from '@azure/communication-calling';
import EventEmitter from 'events';

type CallingSounds = {
  callEndedSound: HTMLAudioElement;
};

/**
 * @private
 */
export class CallingSoundSubscriber {
  private emitter: EventEmitter;
  private call: CallCommon;
  sounds: CallingSounds;

  constructor(call: CallCommon, emitter: EventEmitter) {
    this.call = call;
    this.emitter = emitter;
    this.sounds = this.loadSounds();
  }

  private subscribeCallSoundEvents(): void {
    this.call.on('stateChanged', () => {
      this.emitter.emit('callStateChanged', {
        callState: this.call.state
      });
      if (this.call.state === 'Disconnected') {
        this.sounds.callEndedSound.play();
      }
    });
  }

  private loadSounds(): CallingSounds {
    const callEndedSound = new Audio('');
    return {
      callEndedSound
    };
  }
}
