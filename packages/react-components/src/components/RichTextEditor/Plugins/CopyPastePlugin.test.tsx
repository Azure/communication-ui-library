// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PluginEvent, PasteType } from 'roosterjs-content-model-types';
import { removeImageElement } from './CopyPastePlugin';
import { PluginEventType } from '../../utils/RichTextEditorUtils';

describe('removeImageElement should work correctly', () => {
  test('removeImageElement should remove all image elements when fragment only contains image children', () => {
    const fragment = document.createDocumentFragment();
    const container = fragment.appendChild(document.createElement('div'));
    const containerId = 'container';
    container.id = containerId;
    container.appendChild(document.createElement('img'));
    container.appendChild(document.createElement('img'));
    container.appendChild(document.createElement('img'));

    const event = getPluginEvent(fragment);

    removeImageElement(event);
    expect(fragment.getElementById(containerId)?.outerHTML).toEqual(undefined);
  });

  test('removeImageElement should remove the image element and its parents', () => {
    const fragment = document.createDocumentFragment();
    const container = fragment.appendChild(document.createElement('div'));
    const containerId = 'container';
    container.id = containerId;
    const layer1 = container.appendChild(document.createElement('div'));
    const layer2 = layer1.appendChild(document.createElement('span'));
    const layer3 = layer2.appendChild(document.createElement('p'));
    layer3.appendChild(document.createElement('img'));
    layer3.appendChild(document.createElement('img'));

    const event = getPluginEvent(fragment);

    removeImageElement(event);
    // When a message only contains an image, no content will be pasted.
    expect(fragment.getElementById(containerId)?.outerHTML).toEqual(undefined);
  });

  test('removeImageElement should NOT remove parent element if it contain non-image children', () => {
    const fragment = document.createDocumentFragment();
    const container = fragment.appendChild(document.createElement('div'));
    const containerId = 'container';
    container.id = containerId;
    container.appendChild(document.createElement('img'));
    container.appendChild(document.createElement('text'));

    const event = getPluginEvent(fragment);

    removeImageElement(event);
    expect(fragment.childNodes.length).toEqual(1);
    expect(fragment.firstChild?.childNodes.length).toEqual(1);
    expect(fragment.getElementById(containerId)?.outerHTML).toEqual('<div id="container"><text></text></div>');
  });

  const getPluginEvent = (fragment: DocumentFragment): PluginEvent => {
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
});
