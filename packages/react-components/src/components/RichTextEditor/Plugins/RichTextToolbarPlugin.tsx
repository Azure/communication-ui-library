// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { EditorPlugin, IEditor } from 'roosterjs-content-model-types';
// import { PluginEventType } from '../../utils/RichTextEditorUtils';

/**
 * KeyboardInputPlugin is a plugin for handling keyboard events in the editor.
 */
export class RichTextToolbarPlugin implements EditorPlugin {
  editor: IEditor | null = null;

  getName(): string {
    return 'RichTextToolbarPlugin';
  }

  initialize(editor: IEditor): void {
    this.editor = editor;
  }

  dispose(): void {}

  // onPluginEvent(event: PluginEvent): void {}
}
