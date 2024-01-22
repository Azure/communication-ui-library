// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(file-sharing) */
import { ActiveFileUpload } from '../FileUploadCards';

/* @conditional-compile-remove(file-sharing) */
/**
 * @private
 */
export const hasIncompleteFileUploads = (activeFileUploads: ActiveFileUpload[] | undefined): boolean => {
  return !!(
    activeFileUploads?.length &&
    !activeFileUploads.filter((fileUpload) => !fileUpload.error).every((fileUpload) => fileUpload.uploadComplete)
  );
};

/* @conditional-compile-remove(file-sharing) */
/**
 * @private
 */
export const hasCompletedFileUploads = (activeFileUploads: ActiveFileUpload[] | undefined): boolean => {
  return !!activeFileUploads?.find((file) => !file.error);
};
