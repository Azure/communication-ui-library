// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @private
 *
 * @param fileName
 * @param length
 * @returns string
 */
export const truncatedFileName = (fileName: string, length: number): string => {
  return fileName.substring(0, length).trimEnd() + (fileName.length > length ? '... ' : '');
};

/**
 * @private
 *
 * @param fileName
 * @returns string
 */
export const extension = (fileName: string): string => fileName.split('.').pop() || '';
