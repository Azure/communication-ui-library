// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { BorderFormat, DatasetFormat, ModelToDomContext, ValueSanitizer } from 'roosterjs-content-model-types';

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
  BeforePaste = 'beforePaste',
  ZoomChanged = 'zoomChanged',
  MouseUp = 'mouseUp'
}

/**
 * ContentChanged event source for RoosterJS
 * @private
 */
export enum ContentChangedEventSource {
  Paste = 'Paste'
}

/**
 * Applies the border format to the specified element.
 * If the element is an HTMLTableCellElement, it skips setting editing info
 * and to use classes instead of inline styles.
 * For all other cases, the default format applier is used.
 */
export const borderApplier = (format: BorderFormat, element: HTMLElement, context: ModelToDomContext): void => {
  if (element instanceof HTMLTableCellElement) {
    // don't set format for table cell
    // as it will set inline styles for them
    // we want to use classes instead
  } else if (context.defaultFormatAppliers.border) {
    // apply default formats for all other cases
    context.defaultFormatAppliers.border(format, element, context);
  }
};

/**
 * Applies the dataset format to the given HTML element.
 * If the element is an HTMLTableElement, it skips setting editing info
 * and to use classes instead of inline styles.
 * For all other cases, it applies the default formats.
 */
export const dataSetApplier = (format: DatasetFormat, element: HTMLElement, context: ModelToDomContext): void => {
  if (element instanceof HTMLTableElement) {
    // don't set editing info for tables
    // as it will set inline styles for them
    // we want to use classes instead
  } else if (context.defaultFormatAppliers.dataset) {
    // apply default formats for all other cases
    context.defaultFormatAppliers.dataset(format, element, context);
  }
};

// divParagraphSanitizer and DefaultSanitizers should be deleted from here and used as part of PastePlugin instead (from roosterjs packages)
// https://github.com/microsoft/roosterjs/issues/2737
/**
 * @private
 */
const divParagraphSanitizer = (value: string, tagName: string): string | null => {
  const tag = tagName.toLowerCase();
  if (tag === 'div' || tag === 'p') {
    return null;
  }
  return value;
};

/**
 * @private
 */
export const DefaultSanitizers: Record<string, ValueSanitizer> = {
  width: divParagraphSanitizer,
  height: divParagraphSanitizer,
  'inline-size': divParagraphSanitizer,
  'block-size': divParagraphSanitizer
};
