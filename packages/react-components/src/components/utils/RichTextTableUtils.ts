// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @private
 *
 * String to be replaces by actual values of row and column.
 */
export const ColumnRowReplaceString = '{column} x {row}';

/**
 * @private
 *
 * Function to create key pair for the selected table size.
 */
export function createKey(row: number, column: number): string {
  return `${row},${column}`;
}

/**
 * @private
 *
 * Function to parse key to the selected table size valules.
 */
export function parseKey(key: string): { row: number; column: number } {
  const [row, column] = key.split(',');
  return {
    row: parseInt(row),
    column: parseInt(column)
  };
}
