// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSelector } from 'reselect';
import { getAttachmentUploads } from './baseSelectors';

/**
 * @private
 */
export const attachmentUploadsSelector = createSelector([getAttachmentUploads], (AttachmentUploads) => {
  const files = Object.values(AttachmentUploads || {}).map((AttachmentUpload) => ({
    ...AttachmentUpload,
    uploadComplete: AttachmentUpload.progress === 1
  }));
  return { files: files };
});
