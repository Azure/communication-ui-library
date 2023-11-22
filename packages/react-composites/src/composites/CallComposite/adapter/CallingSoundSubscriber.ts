// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallCommon } from '@azure/communication-calling';
import { CallingSounds } from './CallAdapter';
/* @conditional-compile-remove(calling-sounds) */
import { CommunicationIdentifier, isPhoneNumberIdentifier } from '@azure/communication-common';

type CallingSoundsLoaded = {
  callEndedSound?: HTMLAudioElement;
  callRingingSound?: HTMLAudioElement;
  callBusySound?: HTMLAudioElement;
};

const CALL_REJECTED_CODE = 603;

/**
 * @private
 */
export class CallingSoundSubscriber {
  private call: CallCommon;
  private soundsLoaded?: CallingSoundsLoaded;
  private callee: CommunicationIdentifier[] | undefined;

  constructor(call: CallCommon, callee?: CommunicationIdentifier[], sounds?: CallingSounds) {
    this.call = call;
    this.callee = callee;
    if (sounds) {
      this.soundsLoaded = this.loadSounds(sounds);
      this.subscribeCallSoundEvents();
    }
  }

  private onCallStateChanged = (): void => {
    this.call.on('stateChanged', () => {
      if (isPSTNCall(this.call, this.callee) && this.soundsLoaded?.callRingingSound) {
        this.soundsLoaded.callRingingSound.loop = true;
        this.playSound(this.soundsLoaded.callRingingSound);
      }
      if (
        (this.call.state === 'Connected' || this.call.state === 'Disconnected') &&
        this.soundsLoaded?.callRingingSound
      ) {
        this.soundsLoaded.callRingingSound.loop = false;
        this.soundsLoaded.callRingingSound.pause();
      }
      if (this.call.state === 'Disconnected') {
        if (this.soundsLoaded?.callBusySound && this.call.callEndReason?.code === CALL_REJECTED_CODE) {
          this.playSound(this.soundsLoaded.callBusySound);
        } else if (this.soundsLoaded?.callEndedSound) {
          this.playSound(this.soundsLoaded.callEndedSound);
        }
      }
    });
  };

  private subscribeCallSoundEvents(): void {
    this.onCallStateChanged();
  }

  public unsubscribeAll(): void {
    this.call.off('stateChanged', this.onCallStateChanged);
    if (this.soundsLoaded?.callRingingSound) {
      this.soundsLoaded.callRingingSound.pause();
    }
  }

  private loadSounds(sounds?: CallingSounds): CallingSoundsLoaded | undefined {
    let callEndedSound;
    if (sounds?.callEnded) {
      callEndedSound = new Audio(sounds?.callEnded?.path);
      callEndedSound.preload = 'auto';
    }
    let callRingingSound;
    if (sounds?.callRinging) {
      callRingingSound = new Audio(sounds?.callRinging?.path);
      callRingingSound.preload = 'auto';
    }
    let callBusySound;
    if (sounds?.callBusy) {
      callBusySound = new Audio(sounds?.callBusy?.path);
      callBusySound.preload = 'auto';
    }
    return {
      callEndedSound,
      callRingingSound,
      callBusySound
    };
  }

  private playSound(sound: HTMLAudioElement): void {
    sound.play().catch((e) => {
      console.error(e, 'Failed to play sound, check loader config to make sure it is correct');
    });
  }
}

/**
 * Helper function to allow the calling sound subscriber to determine when to play the ringing
 * sound when making an outbound call.
 */
const isPSTNCall = (call: CallCommon, callee?: CommunicationIdentifier[]): boolean => {
  /* @conditional-compile-remove(calling-sounds) */
  if (
    callee &&
    (callee.length >= 1 || !isPhoneNumberIdentifier(callee[0])) &&
    (call.state === 'Ringing' || call.state === 'Connecting')
  ) {
    return true;
  } else {
    return false;
  }
  return false;
};
