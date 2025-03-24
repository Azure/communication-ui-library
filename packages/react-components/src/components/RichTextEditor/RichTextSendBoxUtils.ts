// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Add component type check to assist in identification for usePropsFor
// to avoid issue where production build does not have the component name

/* @conditional-compile-remove(rich-text-editor) */
/**
 * @private
 */
export const richTextSendBoxIdentifier = Symbol('richTextSendBoxIdentifier');

/* @conditional-compile-remove(rich-text-editor) */
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _isRichTextSendBox = (component: any): boolean => {
  return component?.[richTextSendBoxIdentifier] === true;
};
