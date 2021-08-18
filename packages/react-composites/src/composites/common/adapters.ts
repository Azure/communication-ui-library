// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { ErrorType } from '@internal/react-components';

export interface AdapterState<TState> {
  onStateChange(handler: (state: TState) => void): void;
  offStateChange(handler: (state: TState) => void): void;
  getState(): TState;
}

export interface AdapterPages<TPage> {
  setPage(page: TPage): void;
}

export interface AdapterDisposal {
  dispose(): void;
}

export interface AdapterErrorHandlers {
  /**
   * Clear errors for given error types
   */
  clearErrors(errorTypes: ErrorType[]): void;
}
