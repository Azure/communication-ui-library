// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import type { PluginEvent, EditorPlugin } from 'roosterjs-content-model-types';

/**
 * KeyboardInputPlugin is a plugin for handling keyboard events in the editor.
 */
export default class KeyboardInputPlugin implements EditorPlugin {
  // don't set callback in constructor to be able to update callback without plugin recreation
  onKeyDown?: ((event: KeyboardEvent) => void) | null = null;

  getName(): string {
    return 'KeyboardInputPlugin';
  }

  initialize(): void {}

  dispose(): void {}

  onPluginEvent(event: PluginEvent): void {
    if (this.onKeyDown && event.eventType === 'keyDown' && event.rawEvent instanceof KeyboardEvent) {
      this.onKeyDown(event.rawEvent);
    }
  }
}
