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
   * Arialabel strings for file sharing upload and download file cards
   */
  fileSharing: {
    uploadFileButton: string;
    fileUploadCards: {
      removeFile: string;
      uploading: string;
      uploadCompleted: string;
    };
    fileDownloadCards: {
      downloadFile: string;
    };
  };
}
