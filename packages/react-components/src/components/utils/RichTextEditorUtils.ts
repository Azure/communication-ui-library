// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Plugin event type for RoosterJS plugins
 * @private
 */
export enum PluginEventType {
  EditorReady = 'editorReady',
  BeforeDispose = 'beforeDispose',
  ContentChanged = 'contentChanged',
  Input = 'input',
  KeyDown = 'keyDown',
  BeforePaste = 'beforePaste'
}

/**
 * ContentChanged event source for RoosterJS
 * @private
 */
export enum ContentChangedEventSource {
  Paste = 'Paste'
}
