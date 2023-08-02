// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @beta
 * Error to be displayed to the user in an error bar above SendBox.
 */
export interface SendBoxErrorBarError {
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
export interface SendBoxErrorBarProps {
  /** Error to render */
  error?: SendBoxErrorBarError;
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
