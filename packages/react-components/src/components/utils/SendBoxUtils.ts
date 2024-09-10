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
 * Check if the content has inline image.
 * @internal
 */
export const hasInlineImageContent = (content: string): boolean => {
  const document = new DOMParser().parseFromString(content, 'text/html');
  return !!document.querySelector('img');
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 *
 * @param message - The message content to update.
 * @param initialInlineImages - The initial inline images that comes with the message before editing.
 *
 * @returns The updated message content.
 */
export const updateStylesOfInlineImages = async (
  message: string,
  initialInlineImages: Record<string, string>[]
): Promise<string> => {
  if (message === '') {
    return message;
  }
  const initialInlineImagesIds = initialInlineImages.map((initialInlineImage) => initialInlineImage.id);
  const document = new DOMParser().parseFromString(message ?? '', 'text/html');
  const imagesPromise = Array.from(document.querySelectorAll('img')).map((img) => {
    return new Promise<void>((resolve, rejects) => {
      // The message might content images that comes with the message before editing.
      // This function should only modify the message content for images that are newly added.
      if (initialInlineImagesIds.includes(img.id)) {
        resolve();
        return;
      }
      const imageElement = new Image();
      imageElement.src = img.src;
      imageElement.onload = () => {
        // imageElement is a copy of original img element, so changes need to be made to the original img element
        img.width = imageElement.width;
        img.height = imageElement.height;
        img.style.aspectRatio = `${imageElement.width} / ${imageElement.height}`;
        // Clear maxWidth and maxHeight styles that are set by roosterJS.
        // This is so that they can be set in messageThread styles without using the important flag.
        img.style.maxWidth = '';
        img.style.maxHeight = '';
        resolve();
      };
      imageElement.onerror = () => {
        rejects(`Error loading image ${img.id}`);
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
 * Determines whether the send box should be disabled.
 *
 * @param hasContent - Indicates whether the send box has content.
 * @param hasCompletedAttachmentUploads - Indicates whether attachment uploads have completed.
 * @param hasError - Indicates whether there is an error.
 * @param disabled - Indicates whether the send box is disabled.
 * @returns A boolean value indicating whether the send box should be disabled.
 */
export const isSendBoxButtonDisabled = ({
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

/**
 * @internal
 */
export const modifyInlineImagesInContentString = async (
  content: string,
  initialInlineImages: Record<string, string>[],
  onCompleted?: (content: string) => void
): Promise<void> => {
  let newContent = content;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  try {
    newContent = await updateStylesOfInlineImages(content, initialInlineImages);
  } catch (error) {
    console.error('Error updating inline images: ', error);
  }
  onCompleted?.(newContent);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const removeBrokenImageContentAndClearImageSizeStyles = (content: string): string => {
  const document = new DOMParser().parseFromString(content, 'text/html');
  document.querySelectorAll('img').forEach((img) => {
    // Before submitting/resend the message, we need to trim the unnecessary attributes such as src,
    // which is set to a local svg of a broken image icon at this point.
    // Once message is submitted/resent, it will be fetched again and might not be a broken image anymore,
    // That's why we need to remove the class and data-ui-id attribute of 'broken-image-wrapper'
    if (img.className === 'broken-image-wrapper') {
      img.removeAttribute('class');
      img.removeAttribute('src');
      img.removeAttribute('data-ui-id');
    }
    // Clear maxWidth and maxHeight styles that are set by roosterJS.
    // Clear width and height styles as the width and height is set in attributes
    // This is so that they can be set in messageThread styles without using the important flag.
    img.style.width = '';
    img.style.height = '';
    img.style.maxWidth = '';
    img.style.maxHeight = '';
  });
  return document.body.innerHTML;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getContentWithUpdatedInlineImagesInfo = (
  content: string,
  inlineImageWithProgress: AttachmentMetadataInProgress[]
): string => {
  if (!inlineImageWithProgress || inlineImageWithProgress.length <= 0) {
    return content;
  }
  const document = new DOMParser().parseFromString(content, 'text/html');
  document.querySelectorAll('img').forEach((img) => {
    const imageId = img.id;
    const inlineImage = inlineImageWithProgress.find(
      (image) => !image.error && image.progress === 1 && image.id === imageId
    );
    if (inlineImage) {
      img.id = inlineImage.id;
      img.src = inlineImage.url || img.src;
    }
  });
  return document.body.innerHTML;
};
