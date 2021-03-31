// © Microsoft Corporation. All rights reserved.
import { CallingState } from '../acsDecouplingBridge/CallingState';
import { EventEmitter } from 'events';

const changeEvent = 'stateChanged';

export class StateStore<T extends Record<string, any>> {
  private state: T;
  private readonly transform: ((state: T) => T) | undefined;
  private readonly emitter = new EventEmitter();

  constructor(state: T, transform?: (state: T) => T) {
    this.state = state;
    this.transform = transform;
  }

  getState = (): T => {
    return this.state;
  };

  setState = (newState: T | ((prev: T) => T)): void => {
    const value = typeof newState === 'object' ? newState : newState(this.state);
    const transformedValue = this.transform ? this.transform(value) : value;

    if (this.state === transformedValue) return;

    this.state = transformedValue;
    this.emitter.emit(changeEvent, transformedValue);
  };

  public onStateChange(listener: (state: CallingState) => void): () => void {
    this.emitter.on(changeEvent, listener);
    return () => {
      this.emitter.off(changeEvent, listener);
    };
  }
}
