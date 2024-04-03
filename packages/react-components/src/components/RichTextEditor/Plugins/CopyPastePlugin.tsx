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
      // If the image is the only child of its parent, remove all the parents of this img element before removing the image element.
      let parentNode = image.parentElement;
      const parentsToRemove: Array<HTMLElement | null> = [];
      while (parentNode?.childNodes.length === 1) {
        parentsToRemove.push(parentNode);
        parentNode = parentNode.parentElement;
      }
      parentsToRemove.forEach((parent) => {
        parent?.remove();
      });
      image.remove();
    });
  }
};
