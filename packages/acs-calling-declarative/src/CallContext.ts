// © Microsoft Corporation. All rights reserved.
import EventEmitter from 'events';
import { CallClientState } from './CallClientState';

export class CallContext {
  private _state: CallClientState = {
    calls: []
  };
  private _emitter: EventEmitter = new EventEmitter();

  public setState(state: CallClientState): void {
    this._state = state;
    this._emitter.emit('stateChanged', this._state);
  }

  public getState(): CallClientState {
    return this._state;
  }

  public onStateChange(handler: (state: CallClientState) => void): void {
    this._emitter.on('stateChanged', handler);
  }
}
