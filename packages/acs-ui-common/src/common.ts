// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @internal
 * Converts units of rem to units of pixels
 * @param rem - units of rem
 * @returns units of pixels
 */
export const _convertRemToPx = (rem: number): number => {
  return rem * getBrowserFontSizeInPx();
};

/**
 * @internal
 * Converts units of pixels to units of rem
 * @param px - units of px
 * @returns units of rem
 */
export const _convertPxToRem = (px: number): number => {
  return px / getBrowserFontSizeInPx();
};

const getBrowserFontSizeInPx = (): number => {
  let fontSizeInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  // If browser font size is not a number, default to 16 px
  if (Number.isNaN(fontSizeInPx)) {
    fontSizeInPx = 16;
  }
  return fontSizeInPx;
};

/**
 * @internal
 * Disable dismiss on resize to work around a couple Fluent UI bugs
 * - The Callout is dismissed whenever *any child of window (inclusive)* is resized. In practice, this
 * happens when we change the VideoGallery layout, or even when the video stream element is internally resized
 * by the headless SDK.
 * - We also want to prevent dismiss when chat pane is scrolling especially a new message is added.
 * A side effect of this workaround is that the context menu stays open when window is resized, and may
 * get detached from original target visually. That bug is preferable to the bug when this value is not set -
 * The Callout (frequently) gets dismissed automatically.
 */
export const _preventDismissOnEvent = (
  ev: Event | React.FocusEvent | React.KeyboardEvent | React.MouseEvent
): boolean => {
  return ev.type === 'resize' || ev.type === 'scroll';
};

/**
 * @internal
 * Helper function to get the keys of an object
 */
export function _getKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as Array<keyof T>;
}

/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
/**
 * Data model that represents a chat message attachment
 * where it contains an ID to uniquely identify the attachment,
 * a name that represents the name of file, and
 * a URL to download the attachment.
 *
 * @public
 */
export interface AttachmentMetadata {
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
  url: string;
}

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * Result payload for uploading an image.
 *
 * @beta
 */
export type UploadChatImageResult = {
  /** Id of the image. */
  id: string;
  /** The type of attachment. */
  attachmentType?: 'image' | 'file' | 'unknown';
  /** The name including file extension type of the attachment. */
  name?: string;
};

/**
 * Data model that represents a chat message attachment being uploaded
 * where it contains an ID to uniquely identify the attachment,
 * a name that represents the name of file,
 * an optional URL to download the attachment,
 * an optional progress value between 0 and 1 indicating the progress of the upload, and
 * an optional error object that contains error message would be shown to the user.
 *
 *
 * @beta
 */
export interface AttachmentMetadataInProgress {
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
  /**
   * A number between 0 and 1 indicating the progress of the upload.
   */
  progress?: number;
  /**
   * A object contains error message would be shown to the user.
   */
  error?: AttachmentProgressError;
}

/**
 * @beta
 * A attachment progress error object that contains message to be shown to
 * the user when upload fails.
 */
export interface AttachmentProgressError {
  message: string;
}

/**
 * @beta
 * Message option that defines properties that can be set when
 * sending or updating a chat message.
 * @property metadata - Metadata that contains additional information about the message to be passed between 2 users.
 * @property attachments - Attachments that contains file attachments attached to the message.
 * @property type - Type of the message content, either 'text' or 'html'.
 */
export type MessageOptions = {
  metadata?: Record<string, string>;
  attachments?: AttachmentMetadata[];
  type?: ChatMessageType;
};

/**
 * @beta
 * Type of the message content, either 'text' or 'html'.
 */
export type ChatMessageType = 'text' | 'html';
