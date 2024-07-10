// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PasteType, BeforePasteEvent } from 'roosterjs-content-model-types';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { handleBeforePasteEvent } from './CopyPastePlugin';
import { PluginEventType } from '../../utils/RichTextEditorUtils';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
describe('handleBeforePasteEvent should work correctly', () => {
  test('handleBeforePasteEvent should call onPaste', () => {
    const event = getBeforePastePluginEvent(document.createDocumentFragment());
    const onPaste = jest.fn();
    handleBeforePasteEvent(event, onPaste);
    expect(onPaste).toHaveBeenCalled();
  });
});

const getBeforePastePluginEvent = (fragment: DocumentFragment): BeforePasteEvent => {
  return {
    eventType: PluginEventType.BeforePaste,
    clipboardData: {
      types: ['text/plain', 'text/html'],
      text: '',
      rawHtml: '',
      image: null,
      customValues: {}
    },
    fragment: fragment,
    htmlBefore: '',
    htmlAfter: '',
    htmlAttributes: {},
    pasteType: 'normal' as PasteType,
    domToModelOption: {
      additionalAllowedTags: [],
      additionalDisallowedTags: [],
      additionalFormatParsers: {},
      attributeSanitizers: {},
      formatParserOverride: {},
      processorOverride: {},
      styleSanitizers: {}
    }
  };
};
