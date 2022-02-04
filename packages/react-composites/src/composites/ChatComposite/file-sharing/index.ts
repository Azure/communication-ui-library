// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export * from './FileCard';
export * from './FileCardGroup';
export * from './FileUpload';
export * from './FileUploadButton';
export * from './FileUploadHandler';

/**
 * Metadata used for setting uploaded files by a user using chat composite in a group call.
 * @internal
 */
export type FileSharingMetadata = {
  fileSharingMetadata: string;
};

/**
 * @param fileName
 * @param length
 * @returns string
 */
export const truncatedFileName = (fileName: string, length: number): string => {
  return fileName.substring(0, length).trimEnd() + (fileName.length > length ? '... ' : '');
};

/**
 * @param fileName
 * @returns string
 */
export const extension = (fileName: string): string => fileName.split('.').pop() || '';
