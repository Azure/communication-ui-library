// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Functionality for interfacing with Composite adapter state.
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
 * Functionality for interfacing with Composite adapter pages.
 */
export interface AdapterPages<TPage> {
  /** Set the current page of the Composite */
  setPage(page: TPage): void;
}

/**
 * Functionality for correctly disposing a Composite.
 */
export interface AdapterDisposal {
  /** Dispose of the Composite */
  dispose(): void;
}

/**
 * Error reported via error events and stored in adapter state.
 */
export interface AdapterError extends Error {
  /**
   * The operation that failed.
   */
  target: string;
  /**
   * Error thrown by the failed operation.
   */
  inner: Error;
  /**
   * Timestamp added to the error in the adapter implementation.
   */
  timestamp: Date;
}

/**
 * Adapters stores the latest error for each operation in the state.
 *
 * `target` is an adapter defined string for each unique operation performed by the adapter.
 */
export type AdapterErrors = { [target: string]: AdapterError };
