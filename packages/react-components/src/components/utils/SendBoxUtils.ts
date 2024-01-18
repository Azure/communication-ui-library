// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ActiveFileUpload } from '../FileUploadCards';

/**
 * @private
 */
export const hasIncompleteFileUploads = (props: ActiveFileUpload[] | undefined): boolean => {
  const activeFileUploads = activeFileUploadsTrampoline(props);
  return !!(
    activeFileUploads?.length &&
    !activeFileUploads.filter((fileUpload) => !fileUpload.error).every((fileUpload) => fileUpload.uploadComplete)
  );
};

/**
 * @private
 */
export const hasCompletedFileUploads = (props: ActiveFileUpload[] | undefined): boolean => {
  const activeFileUploads = activeFileUploadsTrampoline(props);
  return !!activeFileUploads?.find((file) => !file.error);
};

/**
 * @private
 */
export const activeFileUploadsTrampoline = (
  activeFileUploads: ActiveFileUpload[] | undefined
): ActiveFileUpload[] | undefined => {
  /* @conditional-compile-remove(file-sharing) */
  return activeFileUploads;
  return [];
};
