// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PluginEvent } from 'roosterjs-editor-types';
import { removeImageElement } from './CopyPastePlugin';

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
    const event = {
      eventType: 10,
      clipboardData: {
        types: ['text/plain', 'text/html'],
        text: '',
        image: null,
        files: [],
        rawHtml: '',
        customValues: {},
        pasteNativeEvent: true,
        snapshotBeforePaste: '<div style="background-color: transparent;"><br></div><!--{"start":[0,0],"end":[0,0]}-->',
        htmlFirstLevelChildTags: ['P', 'P', 'P', 'P']
      },
      fragment: fragment,
      sanitizingOption: {
        elementCallbacks: {},
        attributeCallbacks: {},
        cssStyleCallbacks: {},
        additionalTagReplacements: {},
        additionalAllowedAttributes: [],
        additionalAllowedCssClasses: [
          '^_Entity$',
          '^_EId_',
          '^_EType_',
          '^_EReadonly_',
          'entityDelimiterAfter',
          'entityDelimiterBefore'
        ],
        additionalDefaultStyleValues: {},
        additionalGlobalStyleNodes: [],
        additionalPredefinedCssForElement: {},
        preserveHtmlComments: false,
        unknownTagReplacement: null
      },
      htmlBefore: '',
      htmlAfter: '',
      htmlAttributes: {
        '': ''
      },
      pasteType: 0
    };
    return event;
  };
});
