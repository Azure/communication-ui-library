// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './AttachmentUpload';
export * from './AttachmentUploadButton';

/* @conditional-compile-remove(file-sharing-acs) */
export type {
  AttachmentOptions,
  AttachmentUploadTask,
  AttachmentUploadOptions,
  AttachmentRemovalHandler,
  AttachmentMetadataWrapper,
  AttachmentSelectionHandler,
  AttachmentActionHandler
} from '@internal/react-components';

/* @conditional-compile-remove(file-sharing-acs) */
export type { AttachmentDownloadOptions } from '@internal/react-components';
