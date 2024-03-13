// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(file-sharing) */
import { AttachmentMetadata } from '../FileDownloadCards';

/**
 * @private
 */
export const MAXIMUM_LENGTH_OF_MESSAGE = 8000;
const EMPTY_MESSAGE_REGEX = /^\s*$/;

/* @conditional-compile-remove(file-sharing) */
/**
 * @private
 */
export const hasIncompleteFileUploads = (activeFileUploads: AttachmentMetadata[] | undefined): boolean => {
  return !!(
    activeFileUploads?.length &&
    !activeFileUploads.filter((fileUpload) => !fileUpload.error).every((fileUpload) => fileUpload.progress === 1)
  );
};

/* @conditional-compile-remove(file-sharing) */
/**
 * @private
 */
export const hasCompletedFileUploads = (activeFileUploads: AttachmentMetadata[] | undefined): boolean => {
  return !!activeFileUploads?.find((file) => !file.error);
};

/**
 * @private
 */
export const isMessageTooLong = (valueLength: number): boolean => {
  return valueLength > MAXIMUM_LENGTH_OF_MESSAGE;
};

/**
 * @private
 */
export const sanitizeText = (message: string): string => {
  if (EMPTY_MESSAGE_REGEX.test(message)) {
    return '';
  } else {
    return message;
  }
};
