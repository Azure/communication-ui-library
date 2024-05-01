// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './AttachmentUpload';
export * from './AttachmentUploadButton';

export type {
  AttachmentOptions,
  AttachmentUploadTask,
  AttachmentUploadOptions,
  AttachmentProgressError,
  AttachmentRemovalHandler,
  AttachmentMetadataWrapper,
  AttachmentSelectionHandler
} from '@internal/react-components';

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
export type { AttachmentDownloadOptions } from '@internal/react-components';
