// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { createSelector } from 'reselect';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { getFileUploads, getFileUploadsCompleted } from './baseSelectors';

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const uploadedFilesSelector = createSelector(
  [getFileUploads, getFileUploadsCompleted],
  (fileUploads, fileUploadsCompleted) => {
    return { files: fileUploads, completed: fileUploadsCompleted };
  }
);

/**
 * Workaround to make this module compile under the `--isolatedModules` flag.
 * @internal
 */
export {};
