// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { PluginEvent, EditorPlugin } from 'roosterjs-content-model-types';
import { PluginEventType } from '../../utils/RichTextEditorUtils';

/**
 * KeyboardInputPlugin is a plugin for handling keyboard events in the editor.
 */
export class KeyboardInputPlugin implements EditorPlugin {
  // don't set callback in constructor to be able to update callback without plugin recreation
  onKeyDown?: ((event: KeyboardEvent) => void) | null = null;

  getName(): string {
    return 'KeyboardInputPlugin';
  }

  initialize(): void {}

  dispose(): void {}

  onPluginEvent(event: PluginEvent): void {
    if (this.onKeyDown && event.eventType === PluginEventType.KeyDown && event.rawEvent instanceof KeyboardEvent) {
      this.onKeyDown(event.rawEvent);
    }
  }
}
