// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessage } from '.';

/**
 * Metadata containing basic information about the uploaded file.
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
   * Unique ID of the file.
   */
  id: string;
  /**
   * File name to be displayed.
   */
  name: string;
  /**
   * Download URL for the file.
   */
  url?: string;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   * This is unrelated to the `uploadComplete` property.
   * It is only used to show the progress of the upload.
   * Progress of 1 doesn't mark the upload as complete, set the `uploadComplete`
   * property to true to mark the upload as complete.
   */
  progress?: number;
  payload?: Record<string, string>;
  uploadError?: Error;
}

/**
 * @beta
 */
export interface AttachmentOptions {
  uploadOptions?: AttachmentUploadOptions;
  downloadOptions?: AttachmentDownloadOptions;
}

/**
 * @beta
 */
export interface AttachmentDownloadOptions {
  actionForAttachment: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[];
}

/**
 * @beta
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
 * @beta
 * A callback function for handling file uploads.
 *
 * @param AttachmentUploads - The list of uploaded files. Each file is represented by an {@link AttachmentUpload} object.
 */
export type AttachmentUploadHandler = (attachmentUploads: AttachmentUploadManager[]) => void;

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
