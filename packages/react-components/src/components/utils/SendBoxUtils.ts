// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentMetadata } from '@internal/acs-ui-common';

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

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
// Before sending the image, we need to add the image id we get back after uploading the images to the message content.
export const addUploadedImagesToMessage = (
  message: string,
  uploadInlineImages: AttachmentMetadataInProgress[]
): string => {
  if (message === '') {
    return message;
  }
  const document = new DOMParser().parseFromString(message ?? '', 'text/html');
  document.querySelectorAll('img').forEach((img) => {
    if (!img.id) {
      img.id =
        uploadInlineImages.find((imageUpload) => imageUpload.url === img.src || imageUpload.id === img.id)?.id ?? '';
      img.src = '';
    }
  });
  const newMessage = document.body.innerHTML;
  return newMessage;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const cancelInlineImageUpload = (
  imageSrcArray: string[] | undefined,
  imageUploadsInProgress: AttachmentMetadataInProgress[] | undefined,
  onCancelInlineImageUpload?: (id: string) => void
): void => {
  if (imageSrcArray && imageUploadsInProgress && imageUploadsInProgress?.length > 0) {
    imageUploadsInProgress?.map((uploadImage) => {
      if (uploadImage.url && imageSrcArray && !imageSrcArray?.includes(uploadImage.url)) {
        onCancelInlineImageUpload?.(uploadImage.id);
      }
    });
  }
};

/* @conditional-compile-remove(file-sharing-acs) */
/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const toAttachmentMetadata = (
  attachmentsWithProgress: AttachmentMetadataInProgress[] | undefined,
  /* @conditional-compile-remove(rich-text-editor-image-upload) */ attachmentType?: 'image'
): AttachmentMetadata[] | undefined => {
  return attachmentsWithProgress
    ?.filter((attachment) => {
      return !('error' in attachment) && !attachment.error?.message;
    })
    .map((attachment) => {
      let url = attachment.url || '';
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      if (attachmentType === 'image') {
        url = '';
      }
      return {
        id: attachment.id,
        name: attachment.name,
        url,
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        attachmentType: attachmentType
      };
    });
};

/* @conditional-compile-remove(file-sharing-acs) */
/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const insertAttachmentsAndImages = (
  content: string,
  attachments: AttachmentMetadataInProgress[] | undefined,
  imageUploadsInProgress: AttachmentMetadataInProgress[] | undefined
): { content: string; attachmentArray: AttachmentMetadata[] | undefined } => {
  if (!attachments && !imageUploadsInProgress) {
    return { content, attachmentArray: undefined };
  }
  /* @conditional-compile-remove(file-sharing-acs) */
  let attachmentArray = toAttachmentMetadata(attachments);
  let newContent = content;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  if (imageUploadsInProgress) {
    newContent = addUploadedImagesToMessage(content, imageUploadsInProgress);
    const imageArray = toAttachmentMetadata(imageUploadsInProgress, 'image');
    if (imageArray) {
      attachmentArray = attachmentArray ? attachmentArray?.concat(imageArray) : imageArray;
    }
  }
  return { content: newContent, attachmentArray };
};
