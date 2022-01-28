// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { createSelector } from 'reselect';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { getUploadedFiles, getUploadedFilesCompleted } from './baseSelectors';

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const uploadedFilesSelector = createSelector(
  [getUploadedFiles, getUploadedFilesCompleted],
  (uploadedFiles, uploadedFilesCompleted) => {
    return { files: uploadedFiles, completed: uploadedFilesCompleted };
  }
);
