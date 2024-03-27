// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Metadata containing basic information about the uploaded attachment.
 *
 * @beta
 */
export interface AttachmentMetadata {
  /**
   * Extension hint, useful for rendering a specific icon.
   * An unknown or empty extension will be rendered as a generic icon.
   * Example: `pdf`
   */
  extension: string;
  /**
   * Unique ID of the attachment.
   */
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  id: string;
  /**
   * File name to be displayed.
   */
  name: string;
  /**
   * Download URL for the attachment.
   */
  url: string;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /*
   * Optional dictionary of meta data associated with the attachment.
   */
  payload?: Record<string, string>;
}

/**
 * @internal
 */
export interface AttachmentMenuAction {
  name: string;
  icon: JSX.Element;
  onClick: (attachment: AttachmentMetadata) => void;
}

/**
 * @beta
 * A attachment download error returned via a {@link FileDownloadHandler}.
 * This error message is used to render an error message in the UI.
 */
export interface FileDownloadError {
  /** The error message to display in the UI */
  errorMessage: string;
}

/**
 * @beta
 *
 * A callback function for handling attachment downloads.
 * The function needs to return a promise that resolves to a attachment download URL.
 * If the promise is rejected, the {@link Error.message} will be used to display an error message to the user.
 *
 * @example
 * ```ts
 * const attachmentDownloadHandler: FileDownloadHandler = async (userId, attachmentData) => {
 *   if (isUnauthorizedUser(userId)) {
 *     return { errorMessage: 'You don’t have permission to download this attachment.' };
 *   } else {
 *     return new URL(attachmentData.url);
 *   }
 * }
 *
 * const App = () => (
 *   <ChatComposite
 *     ...
 *     fileSharing={{
 *       fileDownloadHandler: fileDownloadHandler
 *     }}
 *   />
 * )
 *
 * ```
 * @param userId - The user ID of the user downloading the attachment.
 * @param fileMetadata - The {@link AttachmentMetadata} containing file `url`, `extension` and `name`.
 */
export type FileDownloadHandler = (
  userId: string,
  fileMetadata: AttachmentMetadata
) => Promise<URL | FileDownloadError>;

/**
 * Contains the state attributes of a file upload like name, progress etc.
 * @beta
 */
export interface FileUploadState {
  /**
   * Unique identifier for the file upload.
   */
  id: string;

  /**
   * Filename extracted from the {@link File} object.
   * This attribute is used to render the filename if `metadata.name` is not available.
   */
  filename: string;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   */
  progress: number;

  /**
   * Metadata {@link AttachmentMetadata} containing information about the uploaded file.
   */
  metadata?: AttachmentMetadata;

  /**
   * Error message to be displayed to the user if the upload fails.
   */
  error?: FileUploadError;
}

/**
 * @beta
 * Error message to be displayed to the user if the upload fails.
 */
export type FileUploadError = {
  message: string;
  timestamp: number;
};

/**
 * A wrapper object for a file that is being uploaded.
 * Allows managing file uploads by providing common functions for updating the
 * upload progress, canceling an upload, completing an upload etc.
 * @beta
 */
export interface FileUploadManager {
  /**
   * Unique identifier for the file upload.
   */
  id: string;
  /**
   * HTML {@link File} object for the uploaded file.
   */
  file?: File;
  /**
   * Update the progress of the upload.
   * @param value - number between 0 and 1
   */
  notifyUploadProgressChanged: (value: number) => void;
  /**
   * Mark the upload as complete.
   * Requires the `metadata` param containing uploaded file information.
   * @param metadata - {@link AttachmentMetadata}
   */
  notifyUploadCompleted: (metadata: AttachmentMetadata) => void;
  /**
   * Mark the upload as failed.
   * @param message - An error message that can be displayed to the user.
   */
  notifyUploadFailed: (message: string) => void;
}

/**
 * @beta
 * A callback function for handling file uploads.
 *
 * @param userId - The user ID of the user uploading the file.
 * @param fileUploads - The list of uploaded files. Each file is represented by an {@link FileUpload} object.
 */
export type FileUploadHandler = (userId: string, fileUploads: FileUploadManager[]) => void;
