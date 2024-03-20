// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @internal
 * Converts px value to rem value.
 * For example, an input of `16` will return `1rem`.
 */
export const _pxToRem = (px: number): string => `${px / 16}rem`;
