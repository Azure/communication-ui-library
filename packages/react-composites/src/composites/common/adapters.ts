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
