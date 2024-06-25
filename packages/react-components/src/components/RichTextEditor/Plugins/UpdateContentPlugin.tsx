// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { PluginEventType } from '../../utils/RichTextEditorUtils';

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
  onUpdate: ((event: UpdateEvent, imageSrcArray?: Array<string>) => void) | null = null;

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
    let imageSrcArray: Array<string> | undefined;

    switch (event.eventType) {
      case PluginEventType.EditorReady:
        this.onUpdate(UpdateEvent.Init);
        break;

      case PluginEventType.BeforeDispose:
        this.onUpdate(UpdateEvent.Dispose);
        break;

      case PluginEventType.ContentChanged:
        if (
          event.source.toLowerCase() === 'cut' ||
          (event.source.toLowerCase() === 'keyboard' && (event.data === Keys.BACKSPACE || event.data === Keys.DELETE))
        ) {
          event.contentModel?.blocks.map((block) => {
            if (block.blockType === 'Paragraph') {
              const segments = block.segments;
              segments.map((segment) => {
                if (segment.segmentType === 'Image') {
                  if (!imageSrcArray) {
                    imageSrcArray = [];
                  }
                  imageSrcArray?.push(segment.src);
                }
              });
            }
          });
        } else {
          imageSrcArray = undefined;
        }
        this.onUpdate(UpdateEvent.ContentChanged, imageSrcArray);
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
}
