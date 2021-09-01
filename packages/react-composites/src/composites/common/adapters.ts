// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ErrorType } from '@internal/react-components';

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
 * Functionality for interfacing with Composite errors.
 */
export interface AdapterErrorHandlers {
  /**
   * Clear errors for given error types
   */
  clearErrors(errorTypes: ErrorType[]): void;
}
