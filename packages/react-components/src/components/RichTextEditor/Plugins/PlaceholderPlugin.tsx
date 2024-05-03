// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { WatermarkPlugin } from 'roosterjs-content-model-plugins';
// import type { /*PluginEvent, EditorPlugin,*/ IEditor } from 'roosterjs-content-model-types';

/**
 * PlaceholderPlugin is a plugin for displaying placeholder and handle localization for it in the editor.
 */
export default class PlaceholderPlugin extends WatermarkPlugin {
  // private isPlaceholderShown: boolean = false;
  // private editorValue: IEditor | null = null;
  //TODO: apply formatting to the placeholder text
  // updatePlaceholder(placeholder: string): void {
  //   // not available in roosterjs as of 9.2.0
  //   // this.watermark = placeholder;
  //   // hide and show the placeholder to show the latest one
  //   // this needs to be done only if the placeholder is currently shown
  //   if (this.editorValue && this.isPlaceholderShown) {
  //     this.hide(this.editorValue);
  //     this.show(this.editorValue);
  //   }
  // }
  // initialize(editor: IEditor): void {
  //   this.editorValue = editor;
  //   super.initialize(editor);
  // }
  // protected show(editor: IEditor): void {
  //   super.show(editor);
  //   this.isPlaceholderShown = true;
  // }
  // protected hide(editor: IEditor): void {
  //   super.hide(editor);
  //   this.isPlaceholderShown = false;
  // }
}
