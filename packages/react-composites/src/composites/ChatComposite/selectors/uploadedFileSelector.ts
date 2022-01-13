// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { createSelector } from 'reselect';
import { getUploadedFiles, getUploadedFilesCompleted } from './baseSelectors';

/**
 * @private
 */
export const uploadedFilesSelector = createSelector(
  [getUploadedFiles, getUploadedFilesCompleted],
  (uploadedFiles, uploadedFilesCompleted) => {
    return { files: uploadedFiles, completed: uploadedFilesCompleted };
  }
);
