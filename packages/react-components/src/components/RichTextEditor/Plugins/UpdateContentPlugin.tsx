// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { PluginEventType } from '../../utils/RichTextEditorUtils';
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';

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
      case PluginEventType.EditorReady:
        this.onUpdate(UpdateEvent.Init);
        break;

      case PluginEventType.BeforeDispose:
        this.onUpdate(UpdateEvent.Dispose);
        break;

      case PluginEventType.ContentChanged:
        this.onUpdate(UpdateEvent.ContentChanged);
        // this.onDeleteImage(uploadImages);
        console.log('ContentChanged', event);

        break;

      case PluginEventType.Input:
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

  // private onDeleteImage = (uploadImages: AttachmentMetadataInProgress[]): void => {};
}
