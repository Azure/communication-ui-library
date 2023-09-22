// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
