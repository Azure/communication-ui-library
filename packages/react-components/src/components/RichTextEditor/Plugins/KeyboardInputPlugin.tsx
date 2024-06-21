// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { PluginEvent, EditorPlugin, IEditor } from 'roosterjs-content-model-types';
import { PluginEventType } from '../../utils/RichTextEditorUtils';

/**
 * KeyboardInputPlugin is a plugin for handling keyboard events in the editor.
 */
export class KeyboardInputPlugin implements EditorPlugin {
  private editor: IEditor | null = null;
  // don't set callback in constructor to be able to update callback without plugin recreation
  onKeyDown?: ((event: KeyboardEvent) => void) | null = null;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onDelete?: (editor: IEditor) => void;

  getName(): string {
    return 'KeyboardInputPlugin';
  }

  initialize(editor: IEditor): void {
    this.editor = editor;
  }

  dispose(): void {
    this.editor = null;
  }

  onPluginEvent(event: PluginEvent): void {
    if (this.onKeyDown && event.eventType === PluginEventType.KeyDown && event.rawEvent instanceof KeyboardEvent) {
      if (event.rawEvent.key === 'Backspace' || event.rawEvent.key === 'Delete') {
        if (!this.editor) {
          return;
        }
        this.onKeyDown(event.rawEvent);
        this.onDelete && this.onDelete(this.editor);
      }
    }
  }
}
