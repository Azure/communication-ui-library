// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor) */
const _isRichTextSendBox = Symbol('isRichTextSendBox');

/* @conditional-compile-remove(rich-text-editor) */
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRichTextSendBox = (component: any): boolean => {
  return component?.[_isRichTextSendBox] === true;
};
