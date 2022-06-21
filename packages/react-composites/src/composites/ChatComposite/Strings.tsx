// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Arialabel strings for upload file button
   */
  uploadFileButton: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Arialabel strings for remove file upload button
   */
  cancelFileUploadButton: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Arialabel strings for to notify user that file upload started
   */
  uploadingFile: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Arialabel strings for upload file button
   */
  fileUploadCompleted: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Arialabel strings for download file button
   */
  downloadFile: string;
}
