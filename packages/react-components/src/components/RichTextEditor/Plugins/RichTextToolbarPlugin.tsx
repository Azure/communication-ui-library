// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getFormatState } from 'roosterjs-content-model-api';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import type { ContentModelFormatState, EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { PluginEventType } from '../../utils/RichTextEditorUtils';

/**
 * KeyboardInputPlugin is a plugin for handling keyboard events in the editor.
 */
export class RichTextToolbarPlugin implements EditorPlugin {
  private formatState: ContentModelFormatState | null = null;
  private editor: IEditor | null = null;
  onFormatChanged: ((formatState: ContentModelFormatState) => void) | null = null;

  getName(): string {
    return 'RichTextToolbarPlugin';
  }

  initialize(editor: IEditor): void {
    this.editor = editor;
  }

  dispose(): void {
    this.editor = null;
  }

  onPluginEvent(event: PluginEvent): void {
    switch (event.eventType) {
      // KeyDown and MouseUp are used to update the state when the editor is already shown and focused by the user
      case PluginEventType.EditorReady:
      case PluginEventType.ContentChanged:
      case PluginEventType.ZoomChanged:
      case PluginEventType.KeyDown:
      case PluginEventType.MouseUp:
        this.updateFormat();
        break;
    }
  }

  /**
   * Handles the click event of a toolbar button.
   * @param buttonAction - The action to be performed when the button is clicked.
   */
  onToolbarButtonClick(buttonAction: (editor: IEditor) => void): void {
    if (this.editor && !this.editor.isDisposed()) {
      buttonAction(this.editor);
      this.updateFormat();
    }
  }

  /**
   * Updates the format state of the rich text editor and triggers the `onFormatChanged` callback
   * if there is any difference between the new and the current format states.
   */
  updateFormat(): void {
    if (this.editor && this.onFormatChanged) {
      const newFormatState = getFormatState(this.editor);
      // use keys from the format that has more keys or the new format state if there is no current format state
      const keys =
        !this.formatState || getObjectKeys(newFormatState).length > getObjectKeys(this.formatState).length
          ? getObjectKeys(newFormatState)
          : getObjectKeys(this.formatState);
      // check if there is any difference between the new format state and the current format state
      // otherwise the states will produce new objects every time even when the format state is the same
      if (!this.formatState || keys.some((key) => newFormatState[key] !== this.formatState?.[key])) {
        this.formatState = newFormatState;
        this.onFormatChanged(newFormatState);
      }
    }
  }
}
