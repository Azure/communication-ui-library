// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor) */
import { RichTextSendBox } from './RichTextSendBox';

/* @conditional-compile-remove(rich-text-editor) */
const _isRichTextSendBox = Symbol('isRichTextSendBox');

// Add the internal property to the component
/* @conditional-compile-remove(rich-text-editor) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(RichTextSendBox as any)[_isRichTextSendBox] = true;

/* @conditional-compile-remove(rich-text-editor) */
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRichTextSendBox = (component: any): boolean => {
  return component?.[_isRichTextSendBox] === true;
};
