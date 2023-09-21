// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from 'react';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType, PluginDomEvent, BeforePasteEvent, PasteType } from 'roosterjs-editor-types';

export default class KeyDownPlugin implements EditorPlugin {
  private editor: Editor;
  private onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  constructor(onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void) {
    this.onKeyDown = onKeyDown;
  }

  getName() {
    return 'MyPlugin';
  }

  initialize(editor: Editor) {
    this.editor = editor;
  }

  dispose() {
    this.editor = null;
  }

  onPluginEvent(event: PluginEvent) {
    if (event.eventType === PluginEventType.KeyPress) {
      const domEvent = event as PluginDomEvent;
      const keyboardEvent = domEvent.rawEvent as KeyboardEvent;

      if (this.onKeyDown) {
        this.onKeyDown(keyboardEvent);
      }
    }

    if (event.eventType === PluginEventType.BeforePaste) {
      const beforePasteEvent = event as BeforePasteEvent;

      switch (beforePasteEvent.pasteType) {
        case PasteType.AsImage: {
          const imageElement = beforePasteEvent.fragment.firstChild as HTMLElement;
          if (imageElement && imageElement.tagName === 'IMG') {
            imageElement.style.maxHeight = '100px';
          }
          break;
        }
        case PasteType.Normal: {
          beforePasteEvent.fragment.querySelectorAll('img').forEach((image) => {
            image.style.maxHeight = '100px';
          });
          break;
        }
        default:
          break;
      }
    }
  }
}
