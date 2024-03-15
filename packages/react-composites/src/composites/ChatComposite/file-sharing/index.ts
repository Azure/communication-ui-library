// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './AttachmentUpload';
export * from './AttachmentUploadButton';
export * from './AttachmentUploadHandler';

/**
 * Metadata used for setting uploaded files by a user using chat composite in a group call.
 * @internal
 */
export type FileSharingMetadata = {
  fileSharingMetadata: string;
};
