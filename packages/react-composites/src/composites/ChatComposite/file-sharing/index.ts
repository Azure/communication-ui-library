// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './AttachmentUpload';
export * from './AttachmentUploadButton';

export type {
  AttachmentOptions,
  AttachmentProgressError,
  AttachmentUploadOptions,
  AttachmentSelectionHandler,
  AttachmentRemovalHandler,
  AttachmentUploadTask
} from '@internal/react-components';

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
export type { AttachmentDownloadOptions } from '@internal/react-components';

/**
 * Metadata used for setting uploaded attachments by a user using chat composite in a group call.
 * @internal
 */
export type FileSharingMetadata = {
  fileSharingMetadata: string;
};
