// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createSelector } from 'reselect';
import { FileUploadState } from '../file-sharing';
import { getFileUploads } from './baseSelectors';

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
