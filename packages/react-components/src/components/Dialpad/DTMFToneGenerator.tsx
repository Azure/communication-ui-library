// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DtmfTone } from '../..';

/**
 * Class for playing individual DTMF Tones.
 *
 * @internal
 */
export class Tone {
  private context: AudioContext;
  private frequency1: number;
  private frequency2: number;
  private oscillatorNode1: OscillatorNode;
  private oscillatorNode2: OscillatorNode;

  constructor(context: AudioContext, frequency1: number, frequency2: number) {
    this.context = context;
    this.frequency1 = frequency1;
    this.frequency2 = frequency2;
    const gainNode = this.context.createGain();
    gainNode.gain.value = 0.1;
    gainNode.connect(this.context.destination);

    this.oscillatorNode1 = this.context.createOscillator();
    this.oscillatorNode1.frequency.value = this.frequency1;
    this.oscillatorNode1.connect(gainNode);

    this.oscillatorNode2 = this.context.createOscillator();
    this.oscillatorNode2.frequency.value = this.frequency2;
    this.oscillatorNode2.connect(gainNode);
  }

  /**
   * Function to play the tone. will create new ocillators because they are one use objects so we need to make
   * new ones every time we play a tone.
   */
  public play = (): void => {
    const gainNode = this.context.createGain();
    gainNode.gain.value = 0.1;
    gainNode.connect(this.context.destination);

    this.oscillatorNode1 = this.context.createOscillator();
    this.oscillatorNode1.frequency.value = this.frequency1;
    this.oscillatorNode1.connect(gainNode);

    this.oscillatorNode2 = this.context.createOscillator();
    this.oscillatorNode2.frequency.value = this.frequency2;
    this.oscillatorNode2.connect(gainNode);
    this.oscillatorNode1.start();
    this.oscillatorNode2.start();
  };

  /**
   * Function to stop the tone.
   */
  public stop = (): void => {
    this.oscillatorNode1.stop();
    this.oscillatorNode2.stop();
    this.oscillatorNode1.disconnect();
    this.oscillatorNode2.disconnect();
  };
}

/**
 * Tone generator for playing all the DTMF tones.
 *
 * @internal
 */
export class DTMFToneGenerator {
  private tones: Tone[];

  constructor(context: AudioContext) {
    this.tones = [];
    for (const key in dtmfFrequencies) {
      const frequencies = dtmfFrequencies[key];
      this.tones.push(new Tone(context, frequencies.f1, frequencies.f2));
    }
  }

  public playTone = (tone: DtmfTone): void => {
    switch (tone) {
      case 'Num1':
        this.tones[0].play();
        break;
      case 'Num2':
        this.tones[1].play();
        break;
      case 'Num3':
        this.tones[2].play();
        break;
      case 'Num4':
        this.tones[3].play();
        break;
      case 'Num5':
        this.tones[4].play();
        break;
      case 'Num6':
        this.tones[5].play();
        break;
      case 'Num7':
        this.tones[6].play();
        break;
      case 'Num8':
        this.tones[7].play();
        break;
      case 'Num9':
        this.tones[8].play();
        break;
      case 'Star':
        this.tones[9].play();
        break;
      case 'Num0':
        this.tones[10].play();
        break;
      case 'Pound':
        this.tones[11].play();
        break;
      default:
        break;
    }
  };

  public stopTone = (tone: DtmfTone): void => {
    switch (tone) {
      case 'Num1':
        this.tones[0].stop();
        break;
      case 'Num2':
        this.tones[1].stop();
        break;
      case 'Num3':
        this.tones[2].stop();
        break;
      case 'Num4':
        this.tones[3].stop();
        break;
      case 'Num5':
        this.tones[4].stop();
        break;
      case 'Num6':
        this.tones[5].stop();
        break;
      case 'Num7':
        this.tones[6].stop();
        break;
      case 'Num8':
        this.tones[7].stop();
        break;
      case 'Num9':
        this.tones[8].stop();
        break;
      case 'Star':
        this.tones[9].stop();
        break;
      case 'Num0':
        this.tones[10].stop();
        break;
      case 'Pound':
        this.tones[11].stop();
        break;
      default:
        break;
    }
  };
}

/**
 * Mapping of the different dtmf frequencies that are needed for the creation of sound that
 * matches the dtmf tones.
 *
 * @internal
 */
export const dtmfFrequencies = {
  '1': { f1: 697, f2: 1209 },
  '2': { f1: 697, f2: 1336 },
  '3': { f1: 697, f2: 1477 },
  '4': { f1: 770, f2: 1209 },
  '5': { f1: 770, f2: 1336 },
  '6': { f1: 770, f2: 1477 },
  '7': { f1: 852, f2: 1209 },
  '8': { f1: 852, f2: 1336 },
  '9': { f1: 852, f2: 1477 },
  '*': { f1: 941, f2: 1209 },
  '0': { f1: 941, f2: 1336 },
  '#': { f1: 941, f2: 1477 }
};
