// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';

/**
 * @private
 */
export const MAXIMUM_LENGTH_OF_MESSAGE = 8000;
const EMPTY_MESSAGE_REGEX = /^\s*$/;

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
export const hasIncompleteAttachmentUploads = (
  attachmentsWithProgress: AttachmentMetadataInProgress[] | undefined
): boolean => {
  return !!(
    attachmentsWithProgress?.length &&
    !attachmentsWithProgress
      .filter((attachmentUpload) => !attachmentUpload.error)
      .every((attachmentUpload) => attachmentUpload.progress === 1 && attachmentUpload.progress !== undefined)
  );
};

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
export const isAttachmentUploadCompleted = (
  attachmentsWithProgress: AttachmentMetadataInProgress[] | undefined
): boolean => {
  return !!attachmentsWithProgress?.find((attachment) => !attachment.error);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
// Before sending the image, we need to add the image id we get back after uploading the images to the message content.
export const addUploadedImagesToMessage = (
  message: string,
  uploadInlineImages: AttachmentMetadataInProgress[]
): string => {
  const document = new DOMParser().parseFromString(message ?? '', 'text/html');
  document.querySelectorAll('img').forEach((img) => {
    img.id = uploadInlineImages.find((imageUpload) => !imageUpload.error && imageUpload.url === img.src)?.id ?? '';
    img.src = '';
  });
  const newMessage = document.body.innerHTML;
  return newMessage;
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

/**
 * Determines whether the send box should be disabled for ARIA accessibility.
 *
 * @param hasContent - Indicates whether the send box has content.
 * @param hasCompletedAttachmentUploads - Indicates whether attachment uploads have completed.
 * @param hasError - Indicates whether there is an error.
 * @param disabled - Indicates whether the send box is disabled.
 * @returns A boolean value indicating whether the send box should be disabled for ARIA accessibility.
 */
export const isSendBoxButtonAriaDisabled = ({
  hasContent,
  /* @conditional-compile-remove(file-sharing-acs) */
  hasCompletedAttachmentUploads,
  hasError,
  disabled
}: {
  hasContent: boolean;
  /* @conditional-compile-remove(file-sharing-acs) */
  hasCompletedAttachmentUploads: boolean;
  hasError: boolean;
  disabled: boolean;
}): boolean => {
  return (
    // no content
    !(hasContent || /* @conditional-compile-remove(file-sharing-acs) */ hasCompletedAttachmentUploads) ||
    //error message exists
    hasError ||
    disabled
  );
};
