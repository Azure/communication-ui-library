// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { PluginEventType } from '../../utils/RichTextEditorUtils';
import { ChangeSource } from 'roosterjs-content-model-dom';

/**
 * An update mode to indicate when the content update happens
 */
export enum UpdateEvent {
  Init = 'Init',
  Dispose = 'Dispose',
  ContentChanged = 'ContentChanged',
  UserInput = 'UserInput',
  Blur = 'Blur'
}

const enum Keys {
  BACKSPACE = 8,
  DELETE = 46
}

/**
 * A plugin to handle content update
 */
export class UpdateContentPlugin implements EditorPlugin {
  private editor: IEditor | null = null;
  private disposer: (() => void) | null = null;
  // don't set callback in constructor to be able to update callback without plugin recreation
  onUpdate: ((event: UpdateEvent, shouldRemoveInlineImages?: boolean) => void) | null = null;

  getName(): string {
    return 'UpdateContentPlugin';
  }

  /**
   * Initialize this plugin
   * @param editor The editor instance
   */
  initialize(editor: IEditor): void {
    this.editor = editor;
    this.disposer = this.editor.attachDomEvent({
      blur: { beforeDispatch: this.onBlur },
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
    if (this.onUpdate === null) {
      return;
    }
    switch (event.eventType) {
      case PluginEventType.EditorReady:
        this.onUpdate(UpdateEvent.Init);
        break;

      case PluginEventType.BeforeDispose:
        this.onUpdate(UpdateEvent.Dispose);
        break;

      case PluginEventType.CompositionEnd:
        this.onUpdate(UpdateEvent.ContentChanged);
        break;

      case PluginEventType.ContentChanged:
        if (
          event.source === ChangeSource.Cut ||
          // We need to add the paste source here for an edge case:
          // when user select an image that's already in the editor, then paste in an image to replace the selected one,
          // we will only get a paste event.
          // In this case, we need to update the removedInlineImage array to include the replaced image.
          event.source === ChangeSource.Paste ||
          (event.source === ChangeSource.Keyboard && (event.data === Keys.BACKSPACE || event.data === Keys.DELETE))
        ) {
          this.onUpdate(UpdateEvent.ContentChanged, true);
        }
        this.onUpdate(UpdateEvent.ContentChanged);
        break;

      case PluginEventType.Input:
        this.onUpdate(UpdateEvent.UserInput);
        break;
    }
  }

  private onCompositionUpdate = (): void => {
    if (this.onUpdate === null) {
      return;
    }
    this.onUpdate(UpdateEvent.ContentChanged);
  };

  private onBlur = (): void => {
    if (this.onUpdate === null) {
      return;
    }
    this.onUpdate(UpdateEvent.Blur);
  };
}
