// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallCommon } from '@azure/communication-calling';
import EventEmitter from 'events';
import { CallingSounds } from './CallAdapter';
import { CallAdapterLocator } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(calling-sounds) */
import { CallParticipantsLocator } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(calling-sounds) */
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(calling-sounds) */
import { isPhoneNumberIdentifier } from '@azure/communication-common';

type CallingSoundsLoaded = {
  callEndedSound: HTMLAudioElement | undefined;
  callRingingSound?: HTMLAudioElement | undefined;
};

/**
 * @private
 */
export class CallingSoundSubscriber {
  private emitter: EventEmitter;
  private call: CallCommon;
  private soundsLoaded?: CallingSoundsLoaded;
  private callLocator: CallAdapterLocator;

  constructor(call: CallCommon, emitter: EventEmitter, locator: CallAdapterLocator, sounds?: CallingSounds) {
    this.call = call;
    this.emitter = emitter;
    this.callLocator = locator;
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
      if (playRingingSound(this.call, this.callLocator) && this.soundsLoaded?.callRingingSound) {
        this.soundsLoaded.callRingingSound.loop = true;
        this.soundsLoaded.callRingingSound.play().catch((e) => {
          console.error(e, 'Failed to play call ringing sound, check loader config to make sure it is correct');
        });
      }
      if (
        (this.call.state === 'Connected' || this.call.state === 'Disconnected') &&
        this.soundsLoaded?.callRingingSound
      ) {
        this.soundsLoaded.callRingingSound.loop = false;
        this.soundsLoaded.callRingingSound.pause();
      }
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
    let callRingingSound: HTMLAudioElement | undefined;
    if (sounds?.callRinging) {
      callRingingSound = new Audio(sounds?.callRinging?.path);
      callRingingSound.preload = 'auto';
    }
    return {
      callEndedSound,
      callRingingSound
    };
  }
}

/**
 * Helper function to allow the calling sound subscriber to determine when to play the ringing
 * sound when making an outbound call.
 */
const playRingingSound = (call: CallCommon, locator: CallAdapterLocator): boolean => {
  /* @conditional-compile-remove(calling-sounds) */
  const callee = (locator as CallParticipantsLocator).participantIds;
  /* @conditional-compile-remove(calling-sounds) */
  if (
    callee.length >= 1 &&
    !isPhoneNumberIdentifier(fromFlatCommunicationIdentifier(callee[0])) &&
    (call.state === 'Ringing' || call.state === 'Connecting')
  ) {
    return true;
  } else {
    return false;
  }
  return false;
};
