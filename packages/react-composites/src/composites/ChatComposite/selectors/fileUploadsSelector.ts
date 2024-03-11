// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSelector } from 'reselect';
import { getFileUploads } from './baseSelectors';

/**
 * @private
 */
export const fileUploadsSelector = createSelector([getFileUploads], (fileUploads) => {
  const files = Object.values(fileUploads || {}).map((fileUpload) => ({
    ...fileUpload,
    uploadComplete: fileUpload.progress === 1
  }));
  return { files: files };
});
