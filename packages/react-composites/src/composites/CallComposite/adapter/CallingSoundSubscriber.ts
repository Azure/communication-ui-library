// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallCommon } from '@azure/communication-calling';
import { CallingSounds } from './CallAdapter';
import { isPhoneNumberIdentifier } from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-common';

type CallingSoundsLoaded = {
  callEndedSound?: HTMLAudioElement;
  callRingingSound?: HTMLAudioElement;
  callBusySound?: HTMLAudioElement;
};

const CALL_REJECTED_CODE = 603;

const CALL_ENDED_CODE = 0;
const CALL_TRANSFER_SUBCODE = 7015;

/**
 * @private
 */
export class CallingSoundSubscriber {
  private call: CallCommon;
  private soundsLoaded?: CallingSoundsLoaded;
  private callees: CommunicationIdentifier[] | undefined;
  public playingSounds: boolean = false;

  constructor(call: CallCommon, callees?: CommunicationIdentifier[], sounds?: CallingSounds) {
    this.call = call;
    this.callees = callees;
    if (sounds) {
      this.soundsLoaded = this.loadSounds(sounds);
      this.subscribeCallSoundEvents();
    }
  }

  private onCallStateChanged = (): void => {
    this.call.on('stateChanged', () => {
      if (shouldPlayRinging(this.call, this.callees) && this.soundsLoaded?.callRingingSound) {
        this.soundsLoaded.callRingingSound.loop = true;
        this.playSound(this.soundsLoaded.callRingingSound);
        this.playingSounds = true;
      }
      if (!shouldPlayRinging(this.call, this.callees) && this.soundsLoaded?.callRingingSound) {
        this.soundsLoaded.callRingingSound.loop = false;
        this.soundsLoaded.callRingingSound.pause();
        this.playingSounds = false;
      }
      if (this.call.state === 'Disconnected') {
        if (this.soundsLoaded?.callBusySound && this.call.callEndReason?.code === CALL_REJECTED_CODE) {
          this.playSound(this.soundsLoaded.callBusySound);
          this.playingSounds = true;
        } else if (
          this.soundsLoaded?.callEndedSound &&
          this.call.callEndReason?.code === CALL_ENDED_CODE &&
          this.call.callEndReason?.subCode !== CALL_TRANSFER_SUBCODE
        ) {
          this.playSound(this.soundsLoaded.callEndedSound);
          this.playingSounds = true;
        }
      }
    });
  };

  private subscribeCallSoundEvents(): void {
    this.onCallStateChanged();
  }

  public unsubscribeAll(): void {
    this.call?.off('stateChanged', this.onCallStateChanged);
    if (this.soundsLoaded?.callRingingSound) {
      this.soundsLoaded.callRingingSound.pause();
    }
  }

  public pauseSounds(): void {
    if (this.soundsLoaded?.callRingingSound) {
      this.soundsLoaded.callRingingSound.pause();
      this.playingSounds = false;
    }
    if (this.soundsLoaded?.callEndedSound) {
      this.soundsLoaded.callEndedSound.pause();
      this.playingSounds = false;
    }
    if (this.soundsLoaded?.callBusySound) {
      this.soundsLoaded.callBusySound.pause();
      this.playingSounds = false;
    }
  }

  private loadSounds(sounds?: CallingSounds): CallingSoundsLoaded | undefined {
    let callEndedSound;
    if (sounds?.callEnded) {
      callEndedSound = new Audio(sounds?.callEnded?.url);
      callEndedSound.preload = 'auto';
    }
    let callRingingSound;
    if (sounds?.callRinging) {
      callRingingSound = new Audio(sounds?.callRinging?.url);
      callRingingSound.preload = 'auto';
    }
    let callBusySound;
    if (sounds?.callBusy) {
      callBusySound = new Audio(sounds?.callBusy?.url);
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
const shouldPlayRinging = (call: CallCommon, callees?: CommunicationIdentifier[]): boolean => {
  if (
    callees &&
    callees[0] &&
    !isPhoneNumberIdentifier(callees[0]) &&
    (call.state === 'Ringing' || call.state === 'Connecting')
  ) {
    return true;
  } else {
    return false;
  }
};
