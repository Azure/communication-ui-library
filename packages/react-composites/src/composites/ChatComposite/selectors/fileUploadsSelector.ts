// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { createSelector } from 'reselect';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { FileUploadState } from '../file-sharing';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { getFileUploads } from './baseSelectors';

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const fileUploadsSelector = createSelector([getFileUploads], (fileUploads) => {
  let files: FileUploadState[] = [];
  let haveAllFileUploadsCompleted: boolean | undefined = undefined;
  if (fileUploads) {
    files = Object.keys(fileUploads).map((key) => fileUploads[key]);
    haveAllFileUploadsCompleted = Object.keys(fileUploads).every((key) => !!fileUploads[key].metadata);
  }
  return { files: files, completed: haveAllFileUploadsCompleted };
});

/**
 * Workaround to make this module compile under the `--isolatedModules` flag.
 * @internal
 */
export {};
