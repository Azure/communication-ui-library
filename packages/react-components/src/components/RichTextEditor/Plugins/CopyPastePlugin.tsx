// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { PluginEvent, EditorPlugin, IEditor } from 'roosterjs-content-model-types';
import { ContentChangedEventSource, PluginEventType } from '../../utils/RichTextEditorUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { _base64ToBlob } from '@internal/acs-ui-common';

/**
 * CopyPastePlugin is a plugin for handling copy and paste events in the editor.
 */
export default class CopyPastePlugin implements EditorPlugin {
  private editor: IEditor | null = null;
  // don't set value in constructor to be able to update it without plugin recreation
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onPaste?: (event: { content: DocumentFragment }) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onUploadInlineImage?: (imageUrl: string, imageFileName: string) => void;

  getName(): string {
    return 'CopyPastePlugin';
  }

  initialize(editor: IEditor): void {
    this.editor = editor;
  }

  dispose(): void {}

  onPluginEvent(event: PluginEvent): void {
    handleBeforePasteEvent(event, /* @conditional-compile-remove(rich-text-editor-image-upload) */ this.onPaste);
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    handleInlineImage(event, this.onUploadInlineImage);
    if (this.editor !== null && !this.editor.isDisposed()) {
      // scroll the editor to the correct position after pasting content
      scrollToBottomAfterContentPaste(event);
    }
  }
}

/**
 * @internal
 * Exported only for unit testing
 */
export const handleBeforePasteEvent = (
  event: PluginEvent,
  /* @conditional-compile-remove(rich-text-editor-image-upload) */ onPaste?: (event: {
    content: DocumentFragment;
  }) => void
): void => {
  if (event.eventType === PluginEventType.BeforePaste && event.pasteType === 'normal') {
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onPaste?.({ content: event.fragment });
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    return;
  }
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 * Exported only for unit testing
 */
export const handleInlineImage = (
  event: PluginEvent,
  onUploadInlineImage?: (image: string, fileName: string) => void
): void => {
  if (event.eventType === PluginEventType.BeforePaste && event.pasteType === 'normal' && onUploadInlineImage) {
    event.fragment.querySelectorAll('img').forEach((image) => {
      const clipboardImage = event.clipboardData.image;
      const fileName = clipboardImage?.name || clipboardImage?.type.replace('/', '.') || 'image.png';
      // If the image src is an external url, call the onUploadInlineImage callback with the url.
      let imageUrl = image.src;
      if (image.src.startsWith('data:image/')) {
        const blobImage = _base64ToBlob(image.src);
        imageUrl = URL.createObjectURL(blobImage);
      }

      onUploadInlineImage(imageUrl, fileName);

      image.src = imageUrl;
      image.alt = image.alt || 'image';
      image.style.width = '119px'; // TODO: find a way to get the original width and height of the image
    });
  }
};

/**
 * Update the scroll position of the editor after pasting content to ensure the content is visible.
 * @param event - The plugin event.
 */
export const scrollToBottomAfterContentPaste = (event: PluginEvent): void => {
  if (event.eventType === PluginEventType.ContentChanged && event.source === ContentChangedEventSource.Paste) {
    // Get the current selection in the document
    const selection = document.getSelection();

    // Check if a selection exists and it has at least one range
    if (!selection || selection.rangeCount <= 0) {
      // If no selection or range, exit the function
      return;
    }

    // Get the first range of the selection
    // A user can normally only select one range at a time, so the rangeCount will usually be 1
    const range = selection.getRangeAt(0);

    // If the common ancestor container of the range is the document itself,
    // it might mean that the editable element is getting removed from the DOM
    // In such cases, especially in Safari, trying to modify the range might throw a HierarchyRequest error
    if (range.commonAncestorContainer === document) {
      return;
    }

    // Create a temporary span element to use as an anchor for scrolling
    // We can't use the anchor node directly because if it's a Text node, calling scrollIntoView() on it will throw an error
    const tempElement = document.createElement('span');
    // Collapse the range to its end point
    // This means the start and end points of the range will be the same, and it will not contain any content
    range.collapse(false);
    // Insert the temporary element at the cursor's position at the end of the range
    range.insertNode(tempElement);

    // Scroll the temporary element into view
    // the element will be aligned at the center of the scroll container, otherwise, text and images may be positioned incorrectly
    tempElement.scrollIntoView({
      block: 'center'
    });
    tempElement.remove();
  }
};
