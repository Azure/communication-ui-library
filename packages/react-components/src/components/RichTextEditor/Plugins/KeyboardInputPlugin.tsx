// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { PluginEvent, EditorPlugin, IEditor } from 'roosterjs-content-model-types';
import { PluginEventType } from '../../utils/RichTextEditorUtils';

/**
 * KeyboardInputPlugin is a plugin for handling keyboard events in the editor.
 */
export class KeyboardInputPlugin implements EditorPlugin {
  private editor: IEditor | null = null;
  private disposer: (() => void) | null = null;
  // don't set callback in constructor to be able to update callback without plugin recreation
  onKeyDown?: ((event: KeyboardEvent) => void) | null = null;
  onCompositionUpdate?: (() => void) | null = null;

  getName(): string {
    return 'KeyboardInputPlugin';
  }
  /**
   * Initialize this plugin
   * @param editor The editor instance
   */
  initialize(editor: IEditor): void {
    this.editor = editor;
    this.disposer = this.editor.attachDomEvent({
      compositionupdate: { beforeDispatch: this.onCompositionUpdate }
    });
  }

  dispose(): void {
    this.editor = null;

    if (this.disposer) {
      this.disposer();
      this.disposer = null;
    }
  }

  onPluginEvent(event: PluginEvent): void {
    if (this.onKeyDown && event.eventType === PluginEventType.KeyDown && event.rawEvent instanceof KeyboardEvent) {
      this.onKeyDown(event.rawEvent);
    }
  }
}
