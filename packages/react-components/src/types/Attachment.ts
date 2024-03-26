// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessage } from "./ChatMessage";

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
  extension?: string;
  /**
   * Unique ID of the attachment.
   */
  /* @conditional-compile-remove(file-sharing) */
  id: string;
  /**
   * File name to be displayed.
   */
  name: string;
  /**
   * Download URL for the attachment.
   */
  url?: string;
  /**
   * A number between 0 and 1 indicating the progress of the upload.
   */
  progress?: number;
  /**
   * A object contains status message would be shown to the user.
   */
  uploadStatus?: AttachmentUploadStatus;
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
 * A attachment upload status object that contains message to be shown to 
 * the user and a timestamp.
 */
export interface AttachmentUploadStatus {
  message: string;
  timestamp: number;
}

/**
 * @beta
 * 
 * Attachment Options that defines behaviour for uploading and downloading attachments.
 */
export interface AttachmentOptions {
  uploadOptions?: AttachmentUploadOptions;
  downloadOptions?: AttachmentDownloadOptions;
}

/**
 * @beta
 * 
 * Attachment download options defines the list of actions that can be performed on an attachment.
 */
export interface AttachmentDownloadOptions {
  // A callback function that defines what action user can perform on an attachment.
  // by default, the UI library would have default actions that opens file URL in a new tab
  // provide this callback function to override the default actions or add new actions.
  actionForAttachment: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[];
}

/**
 * @beta
 * 
 * Attachment menu action defines buttons that can be shown on the attachment card.
 * If there's one action, it will be shown as a button, if there are multiple actions, it will be shown as a dropdown.
 */
export interface AttachmentMenuAction {
  name: string;
  icon: JSX.Element;
  onClick: (attachment: AttachmentMetadata) => void;
}

/**
 * @beta
 */
export interface AttachmentUploadOptions {
  /**
   * A string containing the comma separated list of accepted file types.
   * Similar to the `accept` attribute of the `<input type="file" />` element.
   * Accepts any type of file if not specified.
   * @beta
   */
  acceptedMimeTypes?: string[];
  /**
   * Allows multiple files to be selected if set to `true`.
   * Similar to the `multiple` attribute of the `<input type="file" />` element.
   * @defaultValue false
   * @beta
   */
  canUploadMultiple?: boolean;
  /**
   * A function of type {@link AttachmentUploadHandler} for handling file uploads.
   * @beta
   */
  handler: AttachmentUploadHandler;
}

/**
 * A wrapper object for a file that is being uploaded.
 * Allows managing file uploads by providing common functions for updating the
 * upload progress, canceling an upload, completing an upload etc.
 * @beta
 */
export interface AttachmentUploadManager {
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
 * @param AttachmentUploads - The list of uploaded files. Each file is represented by an {@link AttachmentUpload} object.
 */
export type AttachmentUploadHandler = (attachmentUploads: AttachmentUploadManager[]) => void;

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
