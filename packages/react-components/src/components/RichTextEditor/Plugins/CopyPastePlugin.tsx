// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { PluginEvent, EditorPlugin, IEditor } from 'roosterjs-content-model-types';
import { ContentChangedEventSource, PluginEventType } from '../../utils/RichTextEditorUtils';
import { blob } from 'stream/consumers';

/**
 * CopyPastePlugin is a plugin for handling copy and paste events in the editor.
 */
export default class CopyPastePlugin implements EditorPlugin {
  private editor: IEditor | null = null;
  onUploadImage: ((image: Blob, fileName: string) => void) | undefined = undefined;

  getName(): string {
    return 'CopyPastePlugin';
  }

  initialize(editor: IEditor): void {
    this.editor = editor;
  }

  dispose(): void {}

  onPluginEvent(event: PluginEvent): void {
    // removeImageElement(event);
    handleInlineImage(event, this.onUploadImage);

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
export const handleInlineImage = (
  event: PluginEvent,
  onUploadImage?: (image: Blob, fileName: string) => void
): void => {
  // We don't support the pasting options such as paste as image yet.
  if (event.eventType === PluginEventType.BeforePaste && event.pasteType === 'normal') {
    event.fragment.querySelectorAll('img').forEach((image) => {
      // If the image is the only child of its parent, remove all the parents of this img element.
      console.log('Leah:::', image.src);
      const imageData = image.src;
      const imageName = image.alt || 'image.png';
      let blobImage: Blob | undefined = undefined;
      if (imageData.startsWith('data:image/png;base64,')) {
        blobImage = base64ToBlob(imageData);
        console.log('Leah::: blobImage', blobImage);
      } else if (imageData.startsWith('http') || imageData.startsWith('blob')) {
        blobImage = featchData();
      }
      if (blobImage) {
        onUploadImage && onUploadImage(blobImage, imageName);
      }
      // const base64 =
      //   'data:image/png;base64,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';
      // const blobImage =
      // var binaryString = atob(base64);
      // var bytes = new Uint8Array(binaryString.length);
      // const blobImage = new Blob([bytes], {type: 'image/png'})

      // const blobImage = b64toBlob(base64);
    });
  }
};

const base64ToBlob = (dataURI: string): Blob => {
  const byteString = atob(dataURI.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: 'image/jpeg' });
};

/**
 * @internal
 * Exported only for unit testing
 */
export const removeImageElement = (event: PluginEvent): void => {
  // We don't support the pasting options such as paste as image yet.
  if (event.eventType === PluginEventType.BeforePaste && event.pasteType === 'normal') {
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
  if (event.eventType === PluginEventType.ContentChanged && event.source === ContentChangedEventSource.Paste) {
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
