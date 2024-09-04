// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Strings used by the {@link ChatComposite} directly.
 *
 * This strings are in addition to those used by the components from the component library.
 *
 * @public
 */
export interface ChatCompositeStrings {
  /**
   * Chat list header text
   */
  chatListHeader: string;

  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Upload Attachment Button text
   */
  uploadAttachment: string;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Error Message for image data is not provided for image upload
   */
  uploadImageDataNotProvided: string;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Error Message for upload image is too large
   */
  uploadImageIsTooLarge: string;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Error Message for unsupported image extension for image upload
   */
  uploadImageExtensionIsNotAllowed: string;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Error Message for unable to upload image
   */
  uploadImageFailed: string;
}
