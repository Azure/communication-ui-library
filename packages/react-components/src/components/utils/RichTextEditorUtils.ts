// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { BorderFormat, DatasetFormat, ModelToDomContext } from 'roosterjs-content-model-types';

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

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getPreviousInlineImages = (content?: string): Record<string, string>[] => {
  if (!content) {
    return [];
  }
  const previousInlineImages: Record<string, string>[] = [];
  const document = new DOMParser().parseFromString(content ?? '', 'text/html');
  Array.from(document.querySelectorAll('img')).map((img) => {
    const imageAttributes = getInlineImageAttributes(img);
    previousInlineImages.push(imageAttributes);
  });
  return previousInlineImages;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getRemovedInlineImages = (
  content: string,
  previousInlineImages: Record<string, string>[]
): Record<string, string>[] => {
  const removedInlineImages: Record<string, string>[] = [];
  const document = new DOMParser().parseFromString(content ?? '', 'text/html');
  const currentContentIds = Array.from(document.querySelectorAll('img')).map((img) => img.id);
  previousInlineImages = previousInlineImages?.filter((img) => !currentContentIds?.includes(img.id));

  previousInlineImages.map((imgAttributes) => {
    removedInlineImages.push(imgAttributes);
  });
  return removedInlineImages;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getAddedInlineImages = (
  content: string,
  previousInlineImages: Record<string, string>[]
): Record<string, string>[] => {
  const addedInlineImages: Record<string, string>[] = [];
  const document = new DOMParser().parseFromString(content ?? '', 'text/html');
  Array.from(document.querySelectorAll('img')).map((img) => {
    if (!previousInlineImages?.find((imgAttributes) => img.id === imgAttributes.id)) {
      const imageAttributes = getInlineImageAttributes(img);
      addedInlineImages.push(imageAttributes);
    }
  });
  return addedInlineImages;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getInlineImageAttributes = (image: HTMLImageElement): Record<string, string> => {
  const imageAttributes: Record<string, string> = {};
  image.getAttributeNames().map((attrName) => {
    const attrValue = image.getAttribute(attrName);
    if (attrValue) {
      imageAttributes[attrName] = attrValue;
    }
  });
  return imageAttributes;
};
