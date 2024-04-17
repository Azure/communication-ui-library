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
   * A callback function of type {@link AttachmentSelectionHandler} that will be called
   * when user finishes selecting files in browser's file picker. This function is required since
   * this would be where upload logic is implemented to your own storage.
   * @beta
   */
  handleAttachmentSelection: AttachmentSelectionHandler;
  /**
   * A optional callback function that will be called
   * when user removing files before clicking send message button. This function will be
   * where you can remove the file from your storage.
   * @beta
   */
  handleAttachmentRemoval?: AttachmentRemovalHandler;
}

/**
 * A upload task represents and manages an attachment that is being uploaded.
 * When using the Composite, an attachment upload task is created for each file user is selected to upload.
 * A upload task is complete when notifyUploadCompleted is called.
 * A upload task is failed when notifyUploadFailed is called.
 * @beta
 */
export interface AttachmentUploadTask {
  /**
   * Unique identifier for the attachment upload task.
   */
  taskId: string;
  /**
   * HTML {@link File} object for the uploaded attachment.
   */
  file?: File;
  /**
   * Update the progress of the upload changed.
   * A upload is considered complete when the progress reaches 1.
   * @param value - number between 0 and 1
   */
  notifyUploadProgressChanged: (value: number) => void;
  /**
   * Mark the upload task as complete.
   * An attachment is considered completed uploading when ID and URL are provided.
   * @param id - the unique identifier of the attachment.
   * @param url - the download URL of the attachment.
   */
  notifyUploadCompleted: (id: string, url: string) => void;
  /**
   * Mark the upload task as failed.
   * @param message - An error message that can be displayed to the user.
   */
  notifyUploadFailed: (message: string) => void;
}

/**
 * @beta
 * A callback function for handling list of upload tasks that contains files selected by user to upload.
 *
 * @param AttachmentUploads - The list of uploaded attachments. Each attachment is represented by an {@link AttachmentUpload} object.
 */
export type AttachmentSelectionHandler = (attachmentUploads: AttachmentUploadTask[]) => void;

/**
 * @beta
 * A callback function for handling attachment removed by the user in send box.
 *
 * @param attachmentId - The ID of uploaded attachments.
 */
export type AttachmentRemovalHandler = (attachmentId: string) => void;
