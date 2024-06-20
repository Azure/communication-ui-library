// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { PluginEvent, EditorPlugin, IEditor, BeforePasteEvent } from 'roosterjs-content-model-types';
import { ContentChangedEventSource, PluginEventType } from '../../utils/RichTextEditorUtils';

/**
 * CopyPastePlugin is a plugin for handling copy and paste events in the editor.
 */
export default class CopyPastePlugin implements EditorPlugin {
  private editor: IEditor | null = null;
  // don't set value in constructor to be able to update it without plugin recreation
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onPaste?: (event: { content: DocumentFragment }) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onUploadImage?: (image: string, fileName: string) => void;

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
    handleInlineImage(event, this.onUploadImage);
    if (this.editor !== null && !this.editor.isDisposed()) {
      // scroll the editor to the correct position after pasting content
      scrollToBottomAfterContentPaste(event);
    }
  }
}

const handleBeforePasteEvent = (
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

    // the initial behavior
    // removes inline image elements from the pasted content when rich-text-editor-image-upload not available
    removeImageElement(event as BeforePasteEvent);
  }
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 * Exported only for unit testing
 */
export const handleInlineImage = (
  event: PluginEvent,
  onUploadImage?: (image: string, fileName: string) => void
): void => {
  // We don't support the pasting options such as paste as image yet.
  if (event.eventType === PluginEventType.BeforePaste && event.pasteType === 'normal') {
    event.fragment.querySelectorAll('img').forEach((image) => {
      if (!image.src.startsWith('data:image/')) {
        return;
      }
      const clipboardImage = event.clipboardData.image;
      const fileName = clipboardImage?.name || clipboardImage?.type.replace('/', '.') || 'image.png';
      const blobImage = base64ToBlob(image.src);
      const blobUrl = URL.createObjectURL(blobImage);
      onUploadImage && onUploadImage(blobUrl, fileName);

      image.src = blobUrl;
      image.alt = image.alt || 'image';
      image.style.width = '200px'; // TODO: change the value after getting the design spec
    });
  }
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const base64ToBlob = (dataURI: string): Blob => {
  const byteString = atob(dataURI.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer]);
};

/**
 * @internal
 * Exported only for unit testing
 */
export const removeImageElement = (event: BeforePasteEvent): void => {
  // We don't support the pasting options such as paste as image yet.
  if (event.pasteType === 'normal') {
    event.fragment.querySelectorAll('img').forEach((image) => {
      // If the image is the only child of its parent, remove all the parents of this img element.
      let parentNode: HTMLElement | null = image.parentElement;
      let currentNode: HTMLElement = image;
      while (parentNode?.childNodes.length === 1) {
        currentNode = parentNode;
        parentNode = parentNode.parentElement;
      }
      currentNode?.remove();
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
