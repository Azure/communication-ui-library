// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { WatermarkPlugin } from 'roosterjs-content-model-plugins';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * PlaceholderPlugin is a plugin for displaying placeholder and handle localization for it in the editor.
 */
export class PlaceholderPlugin extends WatermarkPlugin {
  private isPlaceholderShown: boolean = false;
  private editorValue: IEditor | null = null;
  private disposer: (() => void) | null = null;

  updatePlaceholder(placeholder: string): void {
    this.watermark = placeholder;
    // hide and show the placeholder to show the latest one
    // this needs to be done only if the placeholder is currently shown
    if (this.editorValue && this.isPlaceholderShown) {
      this.hide(this.editorValue);
      this.show(this.editorValue);
    }
  }
  initialize(editor: IEditor): void {
    this.editorValue = editor;
    super.initialize(editor);

    // Hide/show the placeholder as workaround for the placeholder not hiding in some cases
    this.hide(this.editorValue);
    this.show(this.editorValue);

    this.disposer = this.editorValue.attachDomEvent({
      compositionstart: { beforeDispatch: this.onCompositionStart }
    });
  }

  dispose(): void {
    this.editorValue = null;
    if (this.disposer) {
      this.disposer();
      this.disposer = null;
    }
    super.dispose();
  }

  protected show(editor: IEditor): void {
    super.show(editor);
    this.isPlaceholderShown = true;
  }
  protected hide(editor: IEditor): void {
    super.hide(editor);
    this.isPlaceholderShown = false;
  }

  private onCompositionStart = (): void => {
    if (this.editorValue && this.isPlaceholderShown) {
      // Hide the placeholder when composition starts
      this.hide(this.editorValue);
    }
  };
}
