// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './AttachmentUpload';
export * from './AttachmentUploadButton';

export type {
  AttachmentOptions,
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
export type AttachmentHandlingMetadata = {
  attachmentHandlingMetadata: string;
};
