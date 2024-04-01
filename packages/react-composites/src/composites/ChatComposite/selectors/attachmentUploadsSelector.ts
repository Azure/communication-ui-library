// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSelector } from 'reselect';
import { getAttachmentUploads } from './baseSelectors';

/**
 * @private
 */
export const attachmentUploadsSelector = createSelector([getAttachmentUploads], (attachmentUploads) => {
  const attachments = Object.values(attachmentUploads || {}).map((attachmentUpload) => ({
    ...attachmentUpload,
    uploadComplete: !!attachmentUpload
  }));
  return { attachments };
});
