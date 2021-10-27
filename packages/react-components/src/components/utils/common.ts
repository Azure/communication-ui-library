// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Converts units of rem to units of pixels
 * @param rem - units of rem
 * @returns units of pixels
 */
export const convertRemToPx = (rem: number): number => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};
