// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @internal
 * Converts px value to rem value.
 * For example, an input of `16` will return `1rem`.
 */
export const _pxToRem = (px: number): string => `${px / 16}rem`;

/**
 * @internal
 * Converts rem value to px value.
 * For example, an input of `1rem` will return `16`.
 */
export function _remToPx(rem: string | number, baseFontSize: number = 16): number {
  // If the input is a string, strip the 'rem' suffix and convert to number
  if (typeof rem === 'string') {
    return parseFloat(rem) * baseFontSize;
  }
  return rem * baseFontSize;
}
