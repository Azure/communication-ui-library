// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import e from 'express';
import { FileMetadata } from '.';

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

/**
 * @private
 *
 * @param fileSharingMetadata
 * @returns FileMetadata[]
 */
export const extractFileMetadata = (metadata: Record<string, string>): FileMetadata[] => {
  let fileMetadata: FileMetadata[] = [];
  try {
    fileMetadata = metadata.fileSharingMetadata ? JSON.parse(metadata.fileSharingMetadata) : [];
  } catch {
    throw e;
  }
  return fileMetadata;
};
