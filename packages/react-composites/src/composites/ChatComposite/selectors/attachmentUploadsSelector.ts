// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSelector } from 'reselect';
import { getAttachmentUploads } from './baseSelectors';

/**
 * @private
 */
export const attachmentUploadsSelector = createSelector([getAttachmentUploads], (attachmentUploads) => {
  const files = Object.values(attachmentUploads || {}).map((attachmentUpload) => ({
    ...attachmentUpload,
    uploadComplete: !!attachmentUpload
  }));
  return { files: files };
});
