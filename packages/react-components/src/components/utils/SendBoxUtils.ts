// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
/* @conditional-compile-remove(file-sharing-acs) */
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

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
// Before sending the image, we need to add the image id we get back after uploading the images to the message content.
export const addUploadedImagesToMessage = async (
  message: string,
  uploadInlineImages: AttachmentMetadataInProgress[]
): Promise<string> => {
  if (message === '') {
    return message;
  }
  const document = new DOMParser().parseFromString(message ?? '', 'text/html');
  const imagesPromise = Array.from(document.querySelectorAll('img')).map((img) => {
    return new Promise<void>((resolve, rejects) => {
      const uploadInlineImage = uploadInlineImages.find(
        (imageUpload) => !imageUpload.error && (imageUpload.url === img.src || imageUpload.id === img.id)
      );
      const imageElement = new Image();
      imageElement.src = img.src;
      imageElement.onload = () => {
        // imageElement is a copy of original img element, so changes won't be refected
        // have to made changes to 'img' instead
        // imageElement?.setAttribute('width', imageElement.width.toString());
        // imageElement?.setAttribute('height', imageElement.height.toString());
        // imageElement?.setAttribute('style', `aspect-ratio: ${imageElement.width} / ${imageElement.height};`);
        img.id = uploadInlineImage?.id ?? '';
        img.src = '';
        img.width = imageElement.width; // might not be needed since we have set it at line 62
        img.height = imageElement.height;
        img.style.aspectRatio = `${imageElement.width} / ${imageElement.height}`;
        resolve();
      };
      imageElement.onerror = () => {
        rejects();
      };
    });
  });
  await Promise.all(imagesPromise);
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
      if (uploadImage.url && !imageSrcArray?.includes(uploadImage.url)) {
        onCancelInlineImageUpload?.(uploadImage.id);
      }
    });
  }
};

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @internal
 */
export const toAttachmentMetadata = (
  attachmentsWithProgress: AttachmentMetadataInProgress[] | undefined
): AttachmentMetadata[] | undefined => {
  return attachmentsWithProgress
    ?.filter((attachment) => {
      return !('error' in attachment) && !attachment.error?.message;
    })
    .map((attachment) => {
      return {
        id: attachment.id,
        name: attachment.name,
        url: attachment.url ?? ''
      };
    });
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const insertImagesToContentString = async (
  content: string,
  imageUploadsInProgress?: AttachmentMetadataInProgress[],
  onCompleted?: (content: string) => void
): Promise<void> => {
  if (!imageUploadsInProgress || imageUploadsInProgress.length <= 0) {
    onCompleted?.(content);
  }
  const newContent = await addUploadedImagesToMessage(content, imageUploadsInProgress ?? []);
  onCompleted?.(newContent);
};
