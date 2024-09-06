// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ChatAttachment } from '@azure/communication-chat';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
export const getImageAttachmentsFromHTMLContent = (content: string): ChatAttachment[] | undefined => {
  let imageAttachments: ChatAttachment[] | undefined;
  // get image attachments from content,
  // for the editing scenario, this includes the ones before editing and the newly added ones during editing.
  const document = new DOMParser().parseFromString(content ?? '', 'text/html');
  document.querySelectorAll('img').forEach((img) => {
    if (imageAttachments === undefined) {
      imageAttachments = [];
    }
    imageAttachments.push({
      id: img.id,
      attachmentType: 'image'
    });
  });
  return imageAttachments;
};
