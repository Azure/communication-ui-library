// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { PluginEvent, EditorPlugin, IEditor } from 'roosterjs-content-model-types';

/**
 * CopyPastePlugin is a plugin for handling copy and paste events in the editor.
 */
export default class CopyPastePlugin implements EditorPlugin {
  private editor: IEditor | null = null;

  getName(): string {
    return 'CopyPastePlugin';
  }

  initialize(editor: IEditor): void {
    this.editor = editor;
  }

  dispose(): void {}

  onPluginEvent(event: PluginEvent): void {
    removeImageElement(event);
    if (this.editor !== null && !this.editor.isDisposed()) {
      // scroll the editor to the correct position after pasting content
      scrollToBottomAfterContentPaste(event, this.editor);
    }
  }
}

/**
 * @internal
 * Exported only for unit testing
 */
export const removeImageElement = (event: PluginEvent): void => {
  // We don't support the pasting options such as paste as image yet.
  if (event.eventType === 'beforePaste' && event.pasteType === 'normal') {
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
 * Scrolls the editor's scroll container to the bottom after content is pasted.
 * @param event - The plugin event.
 * @param editor - The editor instance.
 */
export const scrollToBottomAfterContentPaste = (event: PluginEvent, editor: IEditor): void => {
  if (event.eventType === 'contentChanged' && event.source === 'Paste') {
    const scrollContainer = editor.getScrollContainer();
    // get current selection for the editor
    const selection = document.getSelection();
    // if selection exists
    if (selection && selection.rangeCount > 0) {
      // the range for the selection
      const range = selection.getRangeAt(0);
      // the selection position relative to the viewport
      const cursorRect = range.getBoundingClientRect();
      // the scrollContainer position relative to the viewport
      const scrollContainerRect = scrollContainer.getBoundingClientRect();
      // 1. scrollContainer.scrollTop represents the number of pixels that the content of scrollContainer is scrolled upward.
      // 2. subtract the top position of the scrollContainer element (scrollContainerRect.top) to
      // translate the scroll position from being relative to the document to being relative to the viewport.
      // 3. add the top position of the cursor (containerRect.top) to moves the scroll position to the cursor's position.
      const updatedScrollTop = scrollContainer.scrollTop - scrollContainerRect.top + cursorRect.top;
      scrollContainer.scrollTo({
        top: updatedScrollTop,
        behavior: 'smooth'
      });
    }
  }
};
