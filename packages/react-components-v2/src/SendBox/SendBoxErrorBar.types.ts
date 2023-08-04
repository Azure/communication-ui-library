// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @internal
 * Error to be displayed to the user in an error bar above SendBox.
 */
export interface _SendBoxErrorBarError {
  /** Error Message to be displayed */
  message: string;
  /**
   * Unix Timestamp. Preferred generation using `Date.now()`
   */
  timestamp: number;
}

/**
 * @internal
 */
export interface _SendBoxErrorBarProps {
  /** Error to render */
  error?: _SendBoxErrorBarError;
  /**
   * Automatically dismisses the error bar after the specified delay in ms.
   * Example: `10 * 1000` would be 10 seconds
   */
  dismissAfterMs?: number;
  /**
   * Callback to invoke when the error bar is dismissed
   */
  onDismiss?: () => void;
}
