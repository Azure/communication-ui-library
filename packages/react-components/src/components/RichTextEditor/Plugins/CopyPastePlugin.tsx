// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PluginEvent, EditorPlugin } from 'roosterjs-editor-types';
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
    // We don't support the pasting options such as paste as image yet.
    if (event.eventType === CompatiblePluginEventType.BeforePaste && event.pasteType === CompatiblePasteType.Normal) {
      event.fragment.querySelectorAll('img').forEach((image) => {
        image.parentElement?.remove();
        image.remove();
      });
    }
  }
}
