// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessage } from './ChatMessage';

/**
 * Metadata containing basic information about attachment.
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
  id: string;
  /**
   * Attachment name to be displayed.
   */
  name: string;
  /**
   * Download URL for the attachment.
   */
  url?: string;
}

/**
 * Metadata containing basic information about the uploading attachment.
 *
 * @beta
 */
export interface AttachmentMetadataWithProgress extends AttachmentMetadata {
  /**
   * A number between 0 and 1 indicating the progress of the upload.
   */
  progress?: number;
  /**
   * A object contains status message would be shown to the user.
   */
  uploadError?: AttachmentUploadStatus;
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
  // by default, the UI library would have default actions that opens attachment URL in a new tab
  // provide this callback function to override the default actions or add new actions.
  actionsForAttachment: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[];
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
  onClick: (attachment: AttachmentMetadata) => Promise<void>;
}

/**
 * @beta
 */
export interface AttachmentUploadOptions {
  /**
   * A list of strings containing the comma separated list of supported media (aka. mime) types.
   * i.e. ['image/*', 'video/*', 'audio/*']
   * Default value is `['*']`, meaning all media types are supported.
   * Similar to the `accept` attribute of the `<input type="attachment" />` element.
   * @beta
   */
  supportedMediaTypes?: string[];
  /**
   * Disable multiple attachments to be selected if set to `true`.
   * Default value is `false`, meaning multiple attachments can be selected.
   * Similar to the `multiple` attribute of the `<input type="attachment" />` element.
   * @beta
   */
  disableMultipleUploads?: boolean;
  /**
   * A function of type {@link AttachmentUploadHandler} for handling attachment uploads.
   * @beta
   */
  handler: AttachmentUploadHandler;
}

/**
 * A wrapper object for a attachment that is being uploaded.
 * Allows managing attachment uploads by providing common functions for updating the
 * upload progress, canceling an upload, completing an upload etc.
 * @beta
 */
export interface AttachmentUploadManager {
  /**
   * Unique identifier for the attachment upload.
   */
  id: string;
  /**
   * HTML {@link File} object for the uploaded attachment.
   */
  file?: File;
  /**
   * Update the progress of the upload changed.
   * A upload is considered complete when the progress reaches 1.
   * @param value - number between 0 and 1
   */
  notifyProgressChanged: (value: number) => void;
  /**
   * Mark the upload as complete.
   * Requires the `metadata` param containing uploaded attachment information.
   * @param metadata - {@link AttachmentMetadata}
   */
  notifyCompleted: (metadata: AttachmentMetadata) => void;
  /**
   * Mark the upload as failed.
   * @param message - An error message that can be displayed to the user.
   */
  notifyFailed: (message: string) => void;
}

/**
 * @beta
 * A callback function for handling attachment uploads.
 *
 * @param AttachmentUploads - The list of uploaded attachments. Each attachment is represented by an {@link AttachmentUpload} object.
 */
export type AttachmentUploadHandler = (attachmentUploads: AttachmentUploadManager[]) => void;
