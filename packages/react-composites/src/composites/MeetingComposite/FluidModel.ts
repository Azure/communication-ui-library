// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureClient, AzureConnectionConfig, AzureContainerServices } from '@fluidframework/azure-client';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { SharedMap, ISharedMap, FluidContainer } from 'fluid-framework';
import { configDetails } from './env';
import { InsecureTokenProvider } from '@fluidframework/test-client-utils';
import { EventEmitter } from 'events';

export interface Poll {
  prompt: string;
  options: PollOption[];
}

export interface PollOption {
  option: string;
  votes: number;
}

export class FluidModel extends EventEmitter {
  constructor(private map: ISharedMap) {
    super();
    this.map.on('valueChanged', (changed) => {
      this.emit('modelChanged');
    });
  }

  public getPoll(): Poll | undefined {
    return {
      prompt: this.getPrompt(),
      options: this.getOptions()
    };
  }

  private getPrompt(): string {
    return this.map.get<string>('prompt') ?? '';
  }

  private getOptions(): PollOption[] {
    return this.optionsWithVotes(this.map.get<string[]>('options') ?? []);
  }

  private getOptionsWithVotes(names: string[]): PollOption[] {
    const keys = new Set(names);
    let options: PollOption[] = [];
    return this.map.forEach((value, key) => {
        if (keys.has(key)) {
            options.push({
                option: key,
                votes: ....
            })
        }
    })
  }
  public votForOption(option: number): void {}

  public setPoll(poll: Poll): void {}
}
