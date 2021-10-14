// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SharedMap, ISharedMap, IFluidContainer } from 'fluid-framework';
import { SharedCounter } from '@fluidframework/counter';
import { EventEmitter } from 'events';
import { PollData, PollOptions } from '../CallComposite';

/** @private */
export class PollFluidModel extends EventEmitter {
  constructor(private container: IFluidContainer) {
    super();
    this.ddsQuestion.on('valueChanged', () => {
      this.emit('modelChanged');
      // We know that this event fires only because of `setPoll`, and that updates the `prompt` and `options` together,
      // so we must subscribe to the new options.
      this.subscribeToOptionUpdates();
    });
    this.ddsQuestion.on('clear', () => {
      this.emit('modelChanged');
    });
    this.subscribeToOptionUpdates();
  }

  private get ddsQuestion(): ISharedMap {
    return this.container.initialObjects.question as ISharedMap;
  }

  public clearPoll(): void {
    console.log('clearPoll called');
    this.ddsQuestion.clear();
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
      const votesCounter: SharedCounter = await votesCounterHandle.get();
      options.push({
        option,
        votes: votesCounter.value
      });
    }
    return options;
  }

  private async subscribeToOptionUpdates(): Promise<void> {
    const ddsOptions = this.ddsQuestion.get<DDSOption[]>('options') ?? [];
    for (const { votesCounterHandle } of ddsOptions) {
      const votesCounter: SharedCounter = await votesCounterHandle.get();
      votesCounter.on('incremented', () => {
        this.emit('modelChanged');
      });
    }
  }

  public async setPoll(poll: PollData): Promise<void> {
    this.clearPoll();
    // This is a problem because the write to propmt and options is not atomic.
    // Ideally there should be a single top-level object that's written atomically.
    this.ddsQuestion.set('prompt', poll.prompt);

    const ddsOptions: DDSOption[] = [];
    for (const { option } of poll.options) {
      const votesCounter = await this.container.create(SharedCounter);
      ddsOptions.push({
        option,
        votesCounterHandle: votesCounter.handle
      });
    }
    this.ddsQuestion.set('options', ddsOptions);
  }

  public async addVoteForOption(index: number): Promise<void> {
    const counter = await this.getVoteCounterForOption(index);
    counter.increment(1);
  }

  public async removeVoteForOption(index: number): Promise<void> {
    const counter = await this.getVoteCounterForOption(index);
    counter.increment(-1);
  }

  private async getVoteCounterForOption(index: number): Promise<SharedCounter> {
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

export class CursorChatFluidModel extends EventEmitter {
  private handRolledReducedCursors: { [key: string]: Cursor } = {};

  constructor(private container: IFluidContainer, private userId: string, displayName: string) {
    super();

    this.handRolledReducedCursors = this.getAllCursors();

    this.ddsCursors.on('valueChanged', ({ key }) => {
      this.updateHandRolledReducedCursors(key);
      this.emit('cursorsChanged');
    });
    this.setCursorChat({ displayName: displayName, x: 0, y: 0, text: '' });
  }

  public get reducedCursors() {
    return this.handRolledReducedCursors;
  }

  public setCursorPosition(x: number, y: number): void {
    this.setCursorChat({ ...this.getOwnCursor(), x, y });
  }

  public setText(text: string): void {
    this.setCursorChat({ ...this.getOwnCursor(), text });
  }

  private getAllCursors(): { [key: string]: Cursor } {
    const cursors = {};
    this.ddsCursors.forEach((cursor: Cursor) => {
      cursors[cursor.displayName] = cursor;
    });
    return cursors;
  }

  private getCursor(userId: string): Cursor {
    return this.ddsCursors.get(userId) as Cursor;
  }

  private getOwnCursor(): Cursor {
    return this.getCursor(this.userId);
  }

  private get ddsCursors(): ISharedMap {
    return this.container.initialObjects.cursors as ISharedMap;
  }

  private setCursorChat(cursor: Cursor): void {
    const { displayName, x, y, text } = cursor;
    this.ddsCursors.set(this.userId, { displayName, x, y, text });
  }

  private updateHandRolledReducedCursors(userId: string): void {
    const handRolledReducedCursors = { ...this.handRolledReducedCursors };
    handRolledReducedCursors[userId] = this.getCursor(userId);

    if (userId === this.userId) {
      handRolledReducedCursors[userId].mine = true;
    }

    this.handRolledReducedCursors = handRolledReducedCursors;
  }
}

interface Cursor {
  displayName: string;
  x: number;
  y: number;
  text: string;
  mine?: boolean;
}

/** @private */
export const containerSchema = {
  initialObjects: { question: SharedMap, cursors: SharedMap },
  dynamicObjectTypes: [SharedMap, SharedCounter]
};
