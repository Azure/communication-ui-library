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
