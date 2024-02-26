// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Class for playing individual DTMF Tones.
 *
 * @internal
 */
export class Tone {
  private context: AudioContext;
  private frequency1: number;
  private frequency2: number;
  private oscillatorNode1?: OscillatorNode;
  private oscillatorNode2?: OscillatorNode;
  private isPlaying: boolean = false;

  constructor(context: AudioContext, frequency1: number, frequency2: number) {
    this.context = context;
    this.frequency1 = frequency1;
    this.frequency2 = frequency2;
  }

  /**
   * Function to play the tone. will create new ocillators because they are one use objects so we need to make
   * new ones every time we play a tone.
   */
  public play = (): void => {
    if (this.isPlaying) {
      return;
    }
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
    this.isPlaying = true;
  };

  /**
   * Function to stop the tone.
   */
  public stop = (): void => {
    if (this.oscillatorNode1 && this.oscillatorNode2) {
      this.oscillatorNode1.stop();
      this.oscillatorNode2.stop();
      this.oscillatorNode1.disconnect();
      this.oscillatorNode2.disconnect();
      this.isPlaying = false;
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

/**
 * Key of the mapping of the different dtmf frequencies that are needed for the creation of sound that
 * matches the dtmf tones.
 *
 * @internal
 */
export type DtmfFrequenciesKeys = keyof typeof dtmfFrequencies;
