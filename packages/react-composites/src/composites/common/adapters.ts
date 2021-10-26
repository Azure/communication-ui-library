// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Functionality for interfacing with Composite adapter state.
 *
 * @public
 */
export interface AdapterState<TState> {
  /** Subscribes the handler to stateChanged events. */
  onStateChange(handler: (state: TState) => void): void;
  /** Unsubscribes the handler to stateChanged events. */
  offStateChange(handler: (state: TState) => void): void;
  /** Get the current State */
  getState(): TState;
}

/**
 * Functionality for correctly disposing a Composite.
 *
 * @public
 */
export interface Disposable {
  /** Dispose of the Composite */
  dispose(): void;
}

/**
 * Error reported via error events and stored in adapter state.
 *
 * @public
 */
export interface AdapterError extends Error {
  /**
   * The operation that failed.
   */
  target: string;
  /**
   * Error thrown by the failed operation.
   */
  innerError: Error;
  /**
   * Timestamp added to the error in the adapter implementation.
   */
  timestamp: Date;
}

/**
 * Adapters stores the latest error for each operation in the state.
 *
 * `target` is an adapter defined string for each unique operation performed by the adapter.
 *
 * @public
 */
export type AdapterErrors = { [target: string]: AdapterError };
