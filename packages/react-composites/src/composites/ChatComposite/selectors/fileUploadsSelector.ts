// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createSelector } from 'reselect';
import { getFileUploads } from './baseSelectors';

/**
 * @private
 */
export const fileUploadsSelector = createSelector([getFileUploads], (fileUploads) => {
  const files = Object.values(fileUploads || {}).map((fileUpload) => ({
    ...fileUpload,
    isUploaded: !!fileUpload.metadata
  }));
  return { files: files };
});
