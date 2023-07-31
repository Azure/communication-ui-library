// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Strings of {@link SendBox} that can be overridden.
 *
 * @public
 */
export interface SendBoxStrings {
  /**
   * Placeholder text in SendBox when there is no user input
   */
  placeholderText: string;
  /**
   * The warning message when send box text length is more than max limit
   */
  textTooLong: string;
  /**
   * Aria label for send message button
   */
  sendButtonAriaLabel: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Error message indicating that all file uploads are not complete.
   */
  fileUploadsPendingError: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Aria label to notify user when focus is on cancel file upload button.
   */
  removeFile: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Aria label to notify user file uploading starts.
   */
  uploading: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Aria label to notify user file is uploaded.
   */
  uploadCompleted: string;
}
