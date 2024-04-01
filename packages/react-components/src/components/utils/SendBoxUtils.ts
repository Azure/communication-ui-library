// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadata } from '../../types/Attachment';

/**
 * @private
 */
export const MAXIMUM_LENGTH_OF_MESSAGE = 8000;
const EMPTY_MESSAGE_REGEX = /^\s*$/;

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
/**
 * @private
 */
export const hasIncompleteAttachmentUploads = (activeAttachmentUploads: AttachmentMetadata[] | undefined): boolean => {
  return !!(
    activeAttachmentUploads?.length &&
    !activeAttachmentUploads
      .filter((attachmentUpload) => !attachmentUpload.uploadError)
      .every((attachmentUpload) => attachmentUpload.progress === 1 || typeof attachmentUpload.progress !== 'undefined')
  );
};

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
/**
 * @private
 */
export const hasCompletedAttachmentUploads = (activeAttachmentUploads: AttachmentMetadata[] | undefined): boolean => {
  return !!activeAttachmentUploads?.find((file) => !file.uploadError);
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
