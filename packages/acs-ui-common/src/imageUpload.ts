// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { BeforePasteEvent } from 'roosterjs-content-model-types';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 * Remove Image tags from the pasted content in rich text editor.
 */
export const _removeImageElementFromPastedContent = (event: BeforePasteEvent): void => {
  if (event.pasteType === 'normal') {
    event.fragment.querySelectorAll('img').forEach((image: HTMLElement) => {
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
