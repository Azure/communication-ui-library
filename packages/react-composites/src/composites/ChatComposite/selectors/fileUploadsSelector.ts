// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { createSelector } from 'reselect';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { getFileUploads, getHaveAllFileUploadsCompleted } from './baseSelectors';

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const fileUploadsSelector = createSelector(
  [getFileUploads, getHaveAllFileUploadsCompleted],
  (fileUploads, haveAllFileUploadsCompleted) => {
    return { files: fileUploads, completed: haveAllFileUploadsCompleted };
  }
);

/**
 * Workaround to make this module compile under the `--isolatedModules` flag.
 * @internal
 */
export {};
