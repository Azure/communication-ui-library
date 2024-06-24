// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
