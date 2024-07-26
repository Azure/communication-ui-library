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
  inlineImages: AttachmentMetadataInProgress[]
): Promise<string> => {
  if (message === '') {
    return message;
  }
  const document = new DOMParser().parseFromString(message ?? '', 'text/html');
  const imagesPromise = Array.from(document.querySelectorAll('img')).map((img) => {
    return new Promise<void>((resolve, rejects) => {
      const uploadInlineImage = inlineImages.find(
        (inlineImage) => !inlineImage.error && (inlineImage.url === img.src || inlineImage.id === img.id)
      );
      // The message might content images that comes with the message before editing, those images are not in the uploadInlineImages array.
      // This function should only modify the message content for images in the uploadInlineImages array.
      if (!uploadInlineImage) {
        resolve();
        return;
      }
      const imageElement = new Image();
      imageElement.src = img.src;
      imageElement.onload = () => {
        // imageElement is a copy of original img element, so changes need to be made to the original img element
        img.id = uploadInlineImage?.id ?? '';
        if (uploadInlineImage?.url) {
          img.src = uploadInlineImage.url;
        }
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
        console.log('Error loading image', img.src);
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
interface CancelInlineImageUploadProps {
  imageSrcArray: string[] | undefined;
  inlineImages: AttachmentMetadataInProgress[] | undefined;
  messageId?: string;
  editBoxOnCancelInlineImageUpload?: (id: string, messageId: string) => void;
  sendBoxOnCancelInlineImageUpload?: (id: string) => void;
}

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const cancelInlineImageUpload = (props: CancelInlineImageUploadProps): void => {
  const { imageSrcArray, inlineImages, messageId, editBoxOnCancelInlineImageUpload, sendBoxOnCancelInlineImageUpload } =
    props;
  if (imageSrcArray && inlineImages && inlineImages?.length > 0) {
    inlineImages?.map((inlineImage) => {
      if (inlineImage.url && !imageSrcArray?.includes(inlineImage.url)) {
        sendBoxOnCancelInlineImageUpload && sendBoxOnCancelInlineImageUpload(inlineImage.id);
        editBoxOnCancelInlineImageUpload && editBoxOnCancelInlineImageUpload(inlineImage.id, messageId || '');
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
  inlineImages?: AttachmentMetadataInProgress[],
  onCompleted?: (content: string) => void
): Promise<void> => {
  if (!inlineImages || inlineImages.length <= 0) {
    onCompleted?.(content);
  }
  const newContent = await addUploadedImagesToMessage(content, inlineImages ?? []);
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
    // This is so that they can be set in messageThread styles without using the important flag.
    img.style.maxWidth = '';
    img.style.maxHeight = '';
  });
  return document.body.innerHTML;
};
