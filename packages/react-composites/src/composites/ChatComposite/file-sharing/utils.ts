// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { FileMetadata } from '.';

/**
 * @private
 *
 * @param fileName
 * @returns string
 */
export const extension = (fileName: string): string => fileName.split('.').pop() || '';

/**
 * @private
 *
 * @param fileSharingMetadata
 * @returns FileMetadata[]
 */
export const extractFileMetadata = (metadata: Record<string, string>): FileMetadata[] => {
  return metadata.fileSharingMetadata ? JSON.parse(metadata.fileSharingMetadata) : [];
};
