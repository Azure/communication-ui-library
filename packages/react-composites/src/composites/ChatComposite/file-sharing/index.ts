// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './FileUpload';
export * from './FileUploadButton';

export type {
  AttachmentUploadStatus,
  AttachmentUploadOptions,
  AttachmentUploadHandler,
  AttachmentUploadManager
} from '@internal/react-components';

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
export type { AttachmentDownloadOptions } from '@internal/react-components';

/**
 * Metadata used for setting uploaded files by a user using chat composite in a group call.
 * @internal
 */
export type FileSharingMetadata = {
  fileSharingMetadata: string;
};
