// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @internal
 *
 * @param fileName
 * @returns string
 */
export const _extension = (fileName: string): string => fileName.split('.').pop() || '';
