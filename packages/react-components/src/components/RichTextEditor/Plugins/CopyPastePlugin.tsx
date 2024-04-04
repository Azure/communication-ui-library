// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { PluginEvent, EditorPlugin } from 'roosterjs-editor-types';
import { CompatiblePluginEventType, CompatiblePasteType } from 'roosterjs-editor-types-compatible';

/**
 * CopyPastePlugin is a plugin for handling copy and paste events in the editor.
 */
export default class CopyPastePlugin implements EditorPlugin {
  getName(): string {
    return 'CopyPastePlugin';
  }

  initialize(): void {}

  dispose(): void {}

  onPluginEvent(event: PluginEvent): void {
    removeImageElement(event);
  }
}

/**
 * @internal
 * Exported only for unit testing
 */
export const removeImageElement = (event: PluginEvent): void => {
  // We don't support the pasting options such as paste as image yet.
  if (event.eventType === CompatiblePluginEventType.BeforePaste && event.pasteType === CompatiblePasteType.Normal) {
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
