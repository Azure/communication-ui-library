// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Functionality for interfacing with Composite adapter state.
 */
export interface AdapterState<TState> {
  onStateChange(handler: (state: TState) => void): void;
  offStateChange(handler: (state: TState) => void): void;
  getState(): TState;
}

/**
 * Functionality for interfacing with Composite adapter pages.
 */
export interface AdapterPages<TPage> {
  setPage(page: TPage): void;
}

/**
 * Functionality for correctly disposing a Composite.
 */
export interface AdapterDisposal {
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
