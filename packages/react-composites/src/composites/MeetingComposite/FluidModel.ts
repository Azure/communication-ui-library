// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SharedMap, ISharedMap, IFluidContainer } from 'fluid-framework';
import { EventEmitter } from 'events';
import { PollData, PollOptions } from '../CallComposite';

/** @private */
export class FluidModel extends EventEmitter {
  constructor(private container: IFluidContainer) {
    super();
    this.ddsQuestion.on('valueChanged', (changed) => {
      this.emit('modelChanged');
      // We know that this event fires only because of `setPoll`, and that updates the `prompt` and `options` together,
      // so we must subscribe to the new options.
      this.subscribeToOptionUpdates();
    });
    this.subscribeToOptionUpdates();
  }

  private get ddsQuestion(): ISharedMap {
    return this.container.initialObjects.question as ISharedMap;
  }

  public async getPoll(): Promise<PollData> {
    return {
      prompt: this.getPrompt(),
      options: await this.getOptions()
    };
  }

  private getPrompt(): string {
    return this.ddsQuestion.get<string>('prompt') ?? '';
  }

  private async getOptions(): Promise<PollOptions> {
    const ddsOptions = this.ddsQuestion.get<DDSOption[]>('options') ?? [];
    const options: PollOptions = [];
    for (const { option, votesCounterHandle } of ddsOptions) {
      const votesCounter: ISharedMap = await votesCounterHandle.get();
      options.push({
        option,
        votes: votesCounter.get('value') ?? 0
      });
    }
    return options;
  }

  private async subscribeToOptionUpdates(): Promise<void> {
    const ddsOptions = this.ddsQuestion.get<DDSOption[]>('options') ?? [];
    for (const { votesCounterHandle } of ddsOptions) {
      const votesCounter: ISharedMap = await votesCounterHandle.get();
      votesCounter.on('valueChanged', (changed) => {
        this.emit('modelChanged');
      });
    }
  }

  public async setPoll(poll: PollData): Promise<void> {
    // This is a problem because the write to propmt and options is not atomic.
    // Ideally there should be a single top-level object that's written atomically.
    this.ddsQuestion.set('prompt', poll.prompt);

    const ddsOptions: DDSOption[] = [];
    for (const { option } of poll.options) {
      // TODO: Use a `SharedCounter`.
      const votesCounter = await this.container.create(SharedMap);
      // votesCounter.on('valueChanged', (changed) => {
      //  this.emit('modelChanged');
      // });
      votesCounter.set('value', 0);
      ddsOptions.push({
        option,
        votesCounterHandle: votesCounter.handle
      });
    }
    this.ddsQuestion.set('options', ddsOptions);
  }

  public async addVoteForOption(index: number): Promise<void> {
    const counter = await this.getVoteCounterForOption(index);
    // TODO: This is not concurrency safe:
    console.log(`Adding vote for ${index}`);
    counter.set('value', counter.get('value') + 1);
  }

  public async removeVoteForOption(index: number): Promise<void> {
    const counter = await this.getVoteCounterForOption(index);
    // TODO: This is not concurrency safe:
    counter.set('value', counter.get('value') - 1);
  }

  private async getVoteCounterForOption(index: number): Promise<ISharedMap> {
    const ddsOptions = this.ddsQuestion.get<DDSOption[]>('options') ?? [];
    if (ddsOptions.length <= index) {
      throw new Error(`attempted to get option ${index}, but only ${ddsOptions.length} exist`);
    }
    return await ddsOptions[index].votesCounterHandle.get();
  }
}

interface DDSOption {
  option: string;
  // IFluidHandle is not exported, unfortunately
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  votesCounterHandle: any;
}

/** @private */
export const containerSchema = {
  initialObjects: { question: SharedMap },
  // TODO: Use `SharedCounter`, but the FluidContainer doesn't like that type here currently.
  dynamicObjectTypes: [SharedMap]
};
