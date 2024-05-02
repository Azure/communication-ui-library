// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';

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

/**
 * A plugin to handle content update
 */
export class UpdateContentPlugin implements EditorPlugin {
  private editor: IEditor | null = null;
  private disposer: (() => void) | null = null;
  // don't set callback in constructor to be able to update callback without plugin recreation
  onUpdate: ((event: UpdateEvent) => void) | null = null;

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
      blur: { beforeDispatch: this.onBlur }
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
      case 'editorReady':
        this.onUpdate(UpdateEvent.Init);
        break;

      case 'beforeDispose':
        this.onUpdate(UpdateEvent.Dispose);
        break;

      case 'contentChanged':
        this.onUpdate(UpdateEvent.ContentChanged);
        break;

      case 'input':
        this.onUpdate(UpdateEvent.UserInput);
        break;
    }
  }

  private onBlur = (): void => {
    if (this.onUpdate === null) {
      return;
    }
    this.onUpdate(UpdateEvent.Blur);
  };
}
