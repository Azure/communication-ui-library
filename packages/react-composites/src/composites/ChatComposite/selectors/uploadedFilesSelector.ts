// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove-from(stable): FILE_SHARING */
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

/**
 * Workaround to make this module compile under the `--isolatedModules` flag.
 * @internal
 */
export {};
